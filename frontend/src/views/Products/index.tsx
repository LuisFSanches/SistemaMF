import { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPen, faPlus, faQrcode, faDownload, faUpload, faSearch } from "@fortawesome/free-solid-svg-icons";
import { PDFDocument, rgb } from 'pdf-lib';
import { StoreProductModal } from "../../components/StoreProductModal";
import { useProducts } from "../../contexts/ProductsContext";
import { Pagination } from "../../components/Pagination";
import { useAdminData } from "../../contexts/AuthContext";
import { SuccessMessage } from "../../components/SuccessMessage";
import { api } from "../../services/api";

import { Container, ProductItem, ProductsContainer, ProductImage, SearchContainer, ActionButtons, ExcelButton } from "./style";
import { PageHeader, PageTitle } from "../../styles/global";
import placeholder_products from '../../assets/images/placeholder_products.png';


export function ProductsPage(){
    const { products, loadAvailableProducts, totalProducts, refreshProducts } = useProducts();
    const { adminData } = useAdminData();

    console.log("ProductsPage adminData:", products);
    
    const [productModal, setProductModal] = useState(false);
    const [action, setAction] = useState("");
    const [currentProduct, setCurrentProduct] = useState({
        id: "",
        name: "",
        image: "",
        price: 0,
        unity: "",
        stock: 0,
        enabled: true
    });
    const [page, setPage] = useState(1);
    const pageSize= 15;
    const [query, setQuery] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [downloading, setDownloading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    function handleOpenProductModal(action:string, product: any){
        setProductModal(true)
        setAction(action)
        setCurrentProduct(product)
    }
    function handleCloseProductModal(){
        setProductModal(false)
    }

    const handleSearchProducts = (text: string) => {
        setQuery(text);
        setPage(1);
    };

    const handleDownloadExcel = async () => {
        if (!adminData.store_id) {
            alert("Erro: Loja não identificada.");
            return;
        }

        try {
            setDownloading(true);
            const token = localStorage.getItem('token')?.replace(/"/g, '');
            
            const response = await fetch(`${api.defaults.baseURL}/store-product/export/excel?storeId=${adminData.store_id}`, {
                method: 'GET',
                headers: {
                    'Authorization': token || '',
                    'x-custom-secret': 'only-mirai-users'
                }
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Erro ao baixar planilha');
            }

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `meus-produtos-${new Date().toISOString().split('T')[0]}.xlsx`;
            document.body.appendChild(a);
            a.click();
            a.remove();
            window.URL.revokeObjectURL(url);

            setShowSuccess(true);
            setTimeout(() => setShowSuccess(false), 3000);
        } catch (error: any) {
            console.error('Erro ao baixar planilha:', error);
            alert(error.message || 'Erro ao baixar planilha. Tente novamente.');
        } finally {
            setDownloading(false);
        }
    };

    const handleFileSelect = () => {
        fileInputRef.current?.click();
    };

    const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        if (!adminData.store_id) {
            alert("Erro: Loja não identificada.");
            return;
        }

        // Validar tipo de arquivo
        const validTypes = ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.ms-excel'];
        if (!validTypes.includes(file.type) && !file.name.endsWith('.xlsx') && !file.name.endsWith('.xls')) {
            alert('Por favor, selecione um arquivo Excel válido (.xlsx ou .xls)');
            event.target.value = '';
            return;
        }

        // Validar tamanho (5MB)
        if (file.size > 5 * 1024 * 1024) {
            alert('O arquivo deve ter no máximo 5MB');
            event.target.value = '';
            return;
        }

        try {
            setUploading(true);
            const formData = new FormData();
            formData.append('storeId', adminData.store_id);
            formData.append('file', file);

            const token = localStorage.getItem('token')?.replace(/"/g, '');
            
            const response = await fetch(`${api.defaults.baseURL}/store-product/update/excel`, {
                method: 'PUT',
                headers: {
                    'Authorization': token || '',
                    'x-custom-secret': 'only-mirai-users'
                },
                body: formData
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Erro ao atualizar produtos');
            }

            alert(`Sucesso! ${data.totalUpdated} produtos atualizados.`);
            setShowSuccess(true);
            setTimeout(() => setShowSuccess(false), 3000);
            
            // Atualiza produtos do contexto
            if (adminData.store_id) {
                await refreshProducts(adminData.store_id);
            }
        } catch (error: any) {
            console.error('Erro ao atualizar produtos:', error);
            alert(error.message || 'Erro ao atualizar produtos. Tente novamente.');
        } finally {
            setUploading(false);
            event.target.value = ''; // Limpa input
        }
    };

    const handleGenerateQRCodesPDF = async () => {
        try {
            // Filtra apenas produtos que têm QR Code
            const productsWithQRCode = products.filter((product: any) => product.qr_code);

            if (productsWithQRCode.length === 0) {
                alert("Nenhum produto com QR Code encontrado nesta página.");
                return;
            }

            // Cria um novo documento PDF
            const pdfDoc = await PDFDocument.create();
            
            // Configurações
            const pageWidth = 595; // A4 width in points
            const pageHeight = 842; // A4 height in points
            const qrSize = 120;
            const margin = 40;
            const spacingX = 20;
            const spacingY = 50;
            const nameSpacing = 10;
            const itemHeight = qrSize + nameSpacing + 30; // QR + nome + espaço extra
            
            // Calcula quantos QR Codes cabem por linha e por coluna
            const itemsPerRow = Math.floor((pageWidth - 2 * margin + spacingX) / (qrSize + spacingX));
            const itemsPerColumn = Math.floor((pageHeight - 2 * margin + spacingY) / itemHeight);
            const itemsPerPage = itemsPerRow * itemsPerColumn;

            let currentPage = pdfDoc.addPage([pageWidth, pageHeight]);
            let itemCount = 0;

            for (const product of productsWithQRCode) {
                // Adiciona nova página se necessário
                if (itemCount > 0 && itemCount % itemsPerPage === 0) {
                    currentPage = pdfDoc.addPage([pageWidth, pageHeight]);
                }

                // Calcula posição do item
                const itemIndex = itemCount % itemsPerPage;
                const row = Math.floor(itemIndex / itemsPerRow);
                const col = itemIndex % itemsPerRow;

                const x = margin + col * (qrSize + spacingX);
                const y = pageHeight - margin - (row + 1) * itemHeight + spacingY;

                // Converte QR Code base64 para imagem
                try {
                    if (!product.qr_code) continue;
                    
                    const qrCodeImage = await pdfDoc.embedPng(product.qr_code);
                    
                    // Desenha o QR Code
                    currentPage.drawImage(qrCodeImage, {
                        x: x,
                        y: y + nameSpacing + 15,
                        width: qrSize,
                        height: qrSize,
                    });

                    // Adiciona o nome do produto abaixo do QR Code
                    const productName = product.name.length > 20 
                        ? product.name.substring(0, 20) + '...' 
                        : product.name;

                    currentPage.drawText(productName, {
                        x: x + qrSize / 2 - (productName.length * 3), // Centraliza aproximadamente
                        y: y + 5,
                        size: 10,
                        color: rgb(0, 0, 0),
                    });

                    // Adiciona o ID do produto (menor)
                    const productId = product.id ? `ID: ${product.id.substring(0, 8)}` : 'ID: N/A';
                    currentPage.drawText(productId, {
                        x: x + qrSize / 2 - (productId.length * 2.5),
                        y: y - 8,
                        size: 7,
                        color: rgb(0.5, 0.5, 0.5),
                    });

                } catch (error) {
                    console.error(`Erro ao processar QR Code do produto ${product.name}:`, error);
                }

                itemCount++;
            }

            // Salva e baixa o PDF
            const pdfBytes = await pdfDoc.save();
            const blob = new Blob([pdfBytes as any], { type: 'application/pdf' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `qrcodes-produtos-pagina-${page}.pdf`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);

        } catch (error) {
            console.error("Erro ao gerar PDF:", error);
            alert("Erro ao gerar PDF. Verifique se os produtos têm QR Codes válidos.");
        }
    };

    useEffect(() => {
        if (!adminData.store_id) return;
        loadAvailableProducts(adminData.store_id, page, pageSize, query);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page, pageSize, query, adminData.store_id]);

    return(
        <Container>
            {showSuccess && (
                <SuccessMessage 
                    message="Operação realizada com sucesso!" 
                    onClose={() => setShowSuccess(false)}
                />
            )}
            
            <PageHeader>
                <PageTitle>
                    <h1>Produtos</h1>
                    <p>Gerencie os produtos da sua loja</p>
                </PageTitle>
                <ActionButtons>
                    <ExcelButton
                        type="button"
                        onClick={handleDownloadExcel}
                        disabled={downloading}
                        className="download"
                    >
                        <FontAwesomeIcon icon={faDownload} />
                        {downloading ? 'Baixando...' : 'Baixar Planilha'}
                    </ExcelButton>
                    <ExcelButton
                        type="button"
                        onClick={handleFileSelect}
                        disabled={uploading}
                        className="upload"
                    >
                        <FontAwesomeIcon icon={faUpload} />
                        {uploading ? 'Atualizando...' : 'Atualizar via Planilha'}
                    </ExcelButton>
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept=".xlsx,.xls"
                        onChange={handleFileUpload}
                        style={{ display: 'none' }}
                    />
                </ActionButtons>
            </PageHeader>

            <SearchContainer>
                <div className="search-box">
                    <FontAwesomeIcon icon={faSearch} />
                    <input
                        type="text"
                        placeholder="Buscar produtos..."
                        value={searchQuery}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
                        onKeyDown={(e: any) => {
                            if (e.key === 'Enter') {
                                handleSearchProducts(searchQuery);
                            }
                        }}
                    />
                    <button 
                        type="button" 
                        onClick={() => handleSearchProducts(searchQuery)}
                        className="search-btn"
                    >
                        Buscar
                    </button>
                </div>

                <div className="action-buttons">
                    <button
                        onClick={handleGenerateQRCodesPDF}
                        className="qr-button"
                    >
                        <FontAwesomeIcon icon={faQrcode}/>
                        <p>Imprimir QRCodes</p>
                    </button>
                    <button
                        onClick={() =>handleOpenProductModal("create", 
                            {id: "", name: "", price: null, unity: "", stock: null, enabled: true})}
                        className="add-button"
                    >
                        <FontAwesomeIcon icon={faPlus}/>
                        <p>Adicionar produto</p>
                    </button>
                </div>
            </SearchContainer>
            
            <ProductsContainer>
                {products?.map((product: any) => (
                    <ProductItem key={product.id} className={product.enabled ? "enabled" : "disabled"}>
                        <ProductImage
                            src={product.image ? product.image : placeholder_products}
                            alt={product.name}
                        />
                        <div className="product-title">
                            <h3>{product.name}</h3>
                        </div>
                        <div className="product-actions">
                            <div className="product-info">
                                <div className="product-status">
                                    <span>
                                        Preço: R$ {product.price}
                                    </span>
                                    <span>
                                        Estoque: {product.stock} {product.unity}
                                    </span>
                                </div>
                                <span> Status:
                                    <strong className={product.enabled ? "enabled" : "disabled"}>
                                        {product.enabled ? "Ativado" : "Desativado"}
                                    </strong>
                                </span>
                            </div>
                        <button onClick={() => handleOpenProductModal("edit", product)}>
                            <FontAwesomeIcon icon={faPen}  className="product-action-icon edit" />
                        </button>
                    </div>
                    </ProductItem>
                ))}
            </ProductsContainer>
            <Pagination
                currentPage={page}
                total={totalProducts}
                pageSize={pageSize as number}
                onPageChange={setPage}
            />
            <StoreProductModal 
                isOpen={productModal}
                onRequestClose={handleCloseProductModal}
                loadData={(storeId) => refreshProducts(storeId)}
                action={action}
                currentProduct={currentProduct}
            />
        </Container>
    )
}