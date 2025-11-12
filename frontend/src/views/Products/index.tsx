import { useState, useEffect } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPen, faPlus, faQrcode } from "@fortawesome/free-solid-svg-icons";
import { PDFDocument, rgb } from 'pdf-lib';
import { ProductModal } from "../../components/ProductModal";
import { useProducts } from "../../contexts/ProductsContext";
import { Pagination } from "../../components/Pagination";

import { Container, ProductItem, ProductsContainer, ProductImage } from "./style";
import { PageHeader, AddButton, Input } from "../../styles/global";
import placeholder_products from '../../assets/images/placeholder_products.png';


export function ProductsPage(){
    const { products, loadAvailableProducts, totalProducts } = useProducts();
    
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
        loadAvailableProducts(page, pageSize, query);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page, pageSize, query]);

    return(
        <Container>
            <PageHeader>
                <h1>Produtos</h1>
                <div className="product-data">
                    <div style={{ position: 'relative', width: '300px', 'marginBottom': '10px' }}>
                        <Input
                            placeholder="Buscar Produtos"
                            onKeyDown={(e: any) => {
                                if (e.key === 'Enter') {
                                    handleSearchProducts(e.target.value);
                                }
                            }}
                        />
                    </div>
                </div>
                <AddButton 
                    onClick={handleGenerateQRCodesPDF}
                    style={{ marginBottom: 0, marginRight: '10px', backgroundColor: '#10b981' }}
                >
                    <FontAwesomeIcon icon={faQrcode}/>
                    <p>Imprimir QRCodes</p>
                </AddButton>
                <AddButton onClick={() =>handleOpenProductModal("create", 
                    {id: "", name: "", price: null, unity: "", stock: null, enabled: true})}
                    style={{ marginBottom: 0 }}
                >
                    <FontAwesomeIcon icon={faPlus}/>
                    <p>Adicionar produto</p>
                </AddButton>
                
            </PageHeader>
            
            <ProductsContainer>
                {products.map((product: any) => (
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
            <ProductModal 
                isOpen={productModal}
                onRequestClose={handleCloseProductModal}
                loadData={() => {}}
                action={action}
                currentProduct={currentProduct}
            />
        </Container>
    )
}