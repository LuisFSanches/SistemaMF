import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { useCart } from "../../contexts/CartContext";
import { listStoreFrontProducts } from "../../services/productService";
import { ProductCard } from "../../components/ProductCard";
import { Pagination } from "../../components/Pagination";
import { Loader } from "../../components/Loader";
import { StoreFrontHeader } from "../../components/StoreFrontHeader";
import placeholder_products from "../../assets/images/placeholder_products.png";
import {
    Container,
    Content,
    PageTitle,
    SearchContainer,
    SearchInput,
    ProductGrid,
    EmptyState,
} from "./style";

export function StoreFront() {
    const { addToCart } = useCart();
    const [products, setProducts] = useState<any[]>([]);
    const [totalProducts, setTotalProducts] = useState(0);
    const [showLoader, setShowLoader] = useState(false);
    const [query, setQuery] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(12);

    const loadAvailableProducts = async (page: number, pageSize: number, query: string) => {
        const { data: { products, total } } = await listStoreFrontProducts(page, pageSize, query);
        setProducts(products);
        setTotalProducts(total);
    }

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            setQuery(searchTerm);
            setPage(1);
        }, 1000);

        return () => clearTimeout(timeoutId);
    }, [searchTerm]);

    useEffect(() => {
        setShowLoader(true);
        loadAvailableProducts(page, pageSize, query).then(() => {
            setTimeout(() => {
                setShowLoader(false);
            }, 350);
        });

    }, [page, pageSize, query]);

    useEffect(() => {
        function handleResize() {
            const width = window.innerWidth;
            if (width < 800) {
                setPageSize(4);
            } else if (width < 1300) {
                setPageSize(8);
            } else {
                setPageSize(12);
            }
        }

        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const handleAddProduct = (product: any, quantity: number, price: number) => {
        addToCart({ ...product, price }, quantity);
    };

    return (
        <Container>
            <StoreFrontHeader showCartButton />

            <Content>
                <PageTitle>Nossos Produtos</PageTitle>

                <SearchContainer>
                    <SearchInput
                        placeholder="Buscar produtos..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </SearchContainer>

                <Loader show={showLoader} />

                {!showLoader && products.length === 0 && (
                    <EmptyState>
                        <FontAwesomeIcon icon={faSearch as any} />
                        <h3>Nenhum produto encontrado</h3>
                        <p>Tente buscar por outro termo</p>
                    </EmptyState>
                )}

                {!showLoader && products.length > 0 && (
                    <>
                        <ProductGrid>
                            {products
                                .filter((product) => product.enabled && product.stock > 0)
                                .map((product) => (
                                    <ProductCard
                                        key={product.id}
                                        product={product}
                                        image={product.image || placeholder_products}
                                        onAdd={handleAddProduct}
                                        editablePrice={false}
                                    />
                                ))}
                        </ProductGrid>

                        <Pagination
                            currentPage={page}
                            total={totalProducts}
                            pageSize={pageSize}
                            onPageChange={setPage}
                        />
                    </>
                )}
            </Content>
        </Container>
    );
}
