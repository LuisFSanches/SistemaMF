import { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faSearch, faDownload, faUpload } from "@fortawesome/free-solid-svg-icons";
import { listProducts } from "../../services/productService";
import { createStoreProduct } from "../../services/storeProductService";
import { Pagination } from "../../components/Pagination";
import { useAdminData } from "../../contexts/AuthContext";
import { useProducts } from "../../contexts/ProductsContext";
import { Loader } from "../../components/Loader";
import { SuccessMessage } from "../../components/SuccessMessage";
import { 
    Container, 
    SearchContainer,
    ActionButton,
    SelectAllContainer,
    ProductsGrid,
    ProductCard,
    CardCheckbox,
    CardImage,
    CardContent,
    CardTitle,
    CardInputGroup,
    CardLabel,
    CardInput,
    EmptyState,
    SearchButton,
    HeaderActions,
    ExcelButton
} from "./style";
import { PageHeader, PageTitle } from "../../styles/global";
import { api } from "../../services/api";
import placeholder_products from '../../assets/images/placeholder_products.png';

interface IProductSelection {
    id: string;
    name: string;
    image?: string;
    price: number;
    stock: number;
    selected: boolean;
}

export function CatalogoGeral() {
    const { adminData } = useAdminData();
    const { refreshProducts } = useProducts();
    const [products, setProducts] = useState<IProductSelection[]>([]);
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [page, setPage] = useState(1);
    const [totalProducts, setTotalProducts] = useState(0);
    const [query, setQuery] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [showSuccess, setShowSuccess] = useState(false);
    const [downloading, setDownloading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const pageSize = 15;

    useEffect(() => {
        fetchProducts();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page, query]);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const response = await listProducts(page, pageSize, query);
            
            const productsWithSelection = response.data.products.map((product: any) => ({
                id: product.id,
                name: product.name,
                image: product.images?.[0] || product.image,
                price: 0,
                stock: 0,
                selected: false
            }));
            
            setProducts(productsWithSelection);
            setTotalProducts(response.data.total);
        } catch (error) {
            console.error("Erro ao buscar produtos:", error);
            alert("Erro ao carregar produtos do catálogo.");
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (text: string) => {
        setQuery(text);
        setPage(1);
    };

    const handleSelectProduct = (productId: string) => {
        setProducts(products.map(product => 
            product.id === productId 
                ? { ...product, selected: !product.selected }
                : product
        ));
    };

    const handleSelectAll = () => {
        const allSelected = products.every(p => p.selected);
        setProducts(products.map(product => ({
            ...product,
            selected: !allSelected
        })));
    };

    const handlePriceChange = (productId: string, value: string) => {
        const numericValue = parseFloat(value) || 0;
        setProducts(products.map(product =>
            product.id === productId
                ? { ...product, price: numericValue }
                : product
        ));
    };

    const handleStockChange = (productId: string, value: string) => {
        const numericValue = parseFloat(value) || 0;
        setProducts(products.map(product =>
            product.id === productId
                ? { ...product, stock: numericValue }
                : product
        ));
    };

    const handleAddSelectedProducts = async () => {
        const selectedProducts = products.filter(p => p.selected);
        
        if (selectedProducts.length === 0) {
            alert("Selecione pelo menos um produto para adicionar.");
            return;
        }

        if (!adminData.store_id) {
            alert("Erro: Loja não identificada.");
            return;
        }

        // Valida se todos os produtos selecionados têm preço e estoque preenchidos
        const invalidProducts = selectedProducts.filter(p => p.price <= 0 || p.stock < 0);
        if (invalidProducts.length > 0) {
            alert("Todos os produtos selecionados devem ter preço maior que zero e estoque válido.");
            return;
        }

        try {
            setSaving(true);
            
            const promises = selectedProducts.map(product => 
                createStoreProduct({
                    store_id: adminData.store_id!,
                    product_id: product.id,
                    price: product.price,
                    stock: product.stock,
                    enabled: true,
                    visible_for_online_store: true
                })
            );

            await Promise.all(promises);
            
            setShowSuccess(true);
            setTimeout(() => setShowSuccess(false), 3000);
            
            // Reseta seleções e valores
            fetchProducts();
        } catch (error: any) {
            console.error("Erro ao adicionar produtos:", error);
            if (error.response?.data?.message?.includes('already exists')) {
                alert("Alguns produtos já estão cadastrados na sua loja.");
            } else {
                alert("Erro ao adicionar produtos. Tente novamente.");
            }
        } finally {
            setSaving(false);
        }
    };

    const handleDownloadExcel = async () => {
        if (!adminData.store_id) {
            alert("Erro: Loja não identificada.");
            return;
        }

        try {
            setDownloading(true);
            const token = localStorage.getItem('token')?.replace(/"/g, '');
            
            const response = await fetch(`${api.defaults.baseURL}/product/export/excel?storeId=${adminData.store_id}`, {
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
            a.download = `produtos-importacao-${new Date().toISOString().split('T')[0]}.xlsx`;
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
            
            const response = await fetch(`${api.defaults.baseURL}/product/import/excel`, {
                method: 'POST',
                headers: {
                    'Authorization': token || '',
                    'x-custom-secret': 'only-mirai-users'
                },
                body: formData
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Erro ao importar planilha');
            }

            alert(`Sucesso! ${data.totalImported} produtos importados.`);
            setShowSuccess(true);
            setTimeout(() => setShowSuccess(false), 3000);
            
            // Recarrega produtos do catálogo geral
            fetchProducts();
            
            // Atualiza produtos do contexto (para outras páginas)
            if (adminData.store_id) {
                await refreshProducts(adminData.store_id);
            }
        } catch (error: any) {
            console.error('Erro ao importar planilha:', error);
            alert(error.message || 'Erro ao importar planilha. Tente novamente.');
        } finally {
            setUploading(false);
            event.target.value = ''; // Limpa input
        }
    };

    const selectedCount = products.filter(p => p.selected).length;
    const allSelected = products.length > 0 && products.every(p => p.selected);

    return (
        <Container>
            {showSuccess && (
                <SuccessMessage 
                    message="Produtos adicionados com sucesso!" 
                    onClose={() => setShowSuccess(false)}
                />
            )}
            
            <PageHeader>
                <PageTitle>
                    <h1>Catálogo Geral de Produtos</h1>
                    <p>Selecione produtos do catálogo para adicionar à sua loja</p>
                </PageTitle>
                <HeaderActions>
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
                        {uploading ? 'Importando...' : 'Importar Planilha'}
                    </ExcelButton>
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept=".xlsx,.xls"
                        onChange={handleFileUpload}
                        style={{ display: 'none' }}
                    />
                </HeaderActions>
            </PageHeader>

            <SearchContainer>
                <div className="search-box">
                    <FontAwesomeIcon icon={faSearch} />
                    <input
                        type="text"
                        placeholder="Buscar produtos no catálogo..."
                        value={searchQuery}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
                        onKeyDown={(e: any) => {
                            if (e.key === 'Enter') {
                                handleSearch(searchQuery);
                            }
                        }}
                    />
                    <SearchButton 
                        type="button" 
                        onClick={() => handleSearch(searchQuery)}
                    >
                        Buscar
                    </SearchButton>
                </div>
                
                <ActionButton
                    onClick={handleAddSelectedProducts}
                    disabled={selectedCount === 0 || saving}
                >
                    <FontAwesomeIcon icon={faPlus} />
                    {saving ? 'Adicionando...' : `Adicionar Produtos Selecionados (${selectedCount})`}
                </ActionButton>
            </SearchContainer>

            {loading ? (
                <Loader show={loading} />
            ) : (
                <>
                    <SelectAllContainer>
                        <input
                            type="checkbox"
                            id="select-all"
                            checked={allSelected}
                            onChange={handleSelectAll}
                        />
                        <label htmlFor="select-all">
                            {allSelected ? 'Desmarcar Todos' : 'Selecionar Todos'}
                        </label>
                    </SelectAllContainer>

                    {products.length === 0 ? (
                        <EmptyState>
                            Nenhum produto encontrado no catálogo
                        </EmptyState>
                    ) : (
                        <ProductsGrid>
                            {products.map((product) => (
                                <ProductCard key={product.id} selected={product.selected}>
                                    <CardCheckbox>
                                        <input
                                            type="checkbox"
                                            checked={product.selected}
                                            onChange={() => handleSelectProduct(product.id)}
                                        />
                                    </CardCheckbox>

                                    <CardImage>
                                        <img
                                            src={product.image || placeholder_products}
                                            alt={product.name}
                                            onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
                                                (e.target as HTMLImageElement).src = placeholder_products;
                                            }}
                                        />
                                    </CardImage>

                                    <CardContent>
                                        <CardTitle>{product.name}</CardTitle>

                                        <CardInputGroup>
                                            <CardLabel>Preço (R$)</CardLabel>
                                            <CardInput
                                                type="number"
                                                min="0"
                                                step="0.01"
                                                value={product.price || ''}
                                                onChange={(e) => handlePriceChange(product.id, e.target.value)}
                                                placeholder="0.00"
                                                disabled={!product.selected}
                                            />
                                        </CardInputGroup>

                                        <CardInputGroup>
                                            <CardLabel>Estoque</CardLabel>
                                            <CardInput
                                                type="number"
                                                min="0"
                                                step="1"
                                                value={product.stock || ''}
                                                onChange={(e) => handleStockChange(product.id, e.target.value)}
                                                placeholder="0"
                                                disabled={!product.selected}
                                            />
                                        </CardInputGroup>
                                    </CardContent>
                                </ProductCard>
                            ))}
                        </ProductsGrid>
                    )}

                    {totalProducts > pageSize && (
                        <Pagination
                            currentPage={page}
                            total={totalProducts}
                            pageSize={pageSize}
                            onPageChange={setPage}
                        />
                    )}
                </>
            )}
        </Container>
    );
}
