import { useState, useEffect } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPen, faPlus } from "@fortawesome/free-solid-svg-icons";
import { ProductModal } from "../../components/ProductModal";
import { useProducts } from "../../contexts/ProductsContext";

import { Container, ProductItem, ProductsContainer } from "./style";
import { PageHeader, AddButton } from "../../styles/global";

export function ProductsPage(){
    const { products, loadAvailableProducts } = useProducts();
    
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

    function handleOpenProductModal(action:string, product: any){
        setProductModal(true)
        setAction(action)
        setCurrentProduct(product)
    }
    function handleCloseProductModal(){
        setProductModal(false)
    }

    useEffect(() => {
        if (window.location.pathname === "/produtos") {
            loadAvailableProducts(1, 500, '');
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return(
        <Container>
            <PageHeader>
                <h1>Produtos</h1>
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
                        <div className="product-title">
                            <h3>{product.name}</h3>
                        </div>
                        <div className="product-actions">
                            <div className="product-info">
                                <span>
                                    Preço: R$ {product.price}
                                </span>
                                <span>
                                    Estoque: {product.stock} {product.unity}
                                </span>
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