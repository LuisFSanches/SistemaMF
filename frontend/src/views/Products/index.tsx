import { useState, useEffect } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPen, faPlus } from "@fortawesome/free-solid-svg-icons";
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