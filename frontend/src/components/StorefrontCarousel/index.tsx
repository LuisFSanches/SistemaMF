import { useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft, faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { useCart } from "../../contexts/CartContext";
import { ProductCard } from "../ProductCard";
import { IStoreCarousel } from "../../interfaces/IStoreCarousel";
import placeholder_products from "../../assets/images/placeholder_products.png";
import {
    CarouselSection,
    CarouselHeader,
    CarouselTitle,
    CarouselTrackWrapper,
    NavButton,
    CarouselTrack,
} from "./style";

interface StorefrontCarouselProps {
    carousel: IStoreCarousel;
}

export function StorefrontCarousel({ carousel }: StorefrontCarouselProps) {
    const { addToCart } = useCart();
    const trackRef = useRef<HTMLDivElement>(null);
    const titleWords = carousel.name.split(" ");
    const strongCount = titleWords.length <= 3 ? 1 : 3;
    const normalWords = titleWords.slice(0, titleWords.length - strongCount);
    const strongWords = titleWords.slice(titleWords.length - strongCount);

    const scroll = (direction: "left" | "right") => {
        if (trackRef.current) {
            const amount = 300;
            trackRef.current.scrollBy({
                left: direction === "left" ? -amount : amount,
                behavior: "smooth",
            });
        }
    };

    const handleAddProduct = (product: any, quantity: number, price: number) => {
        addToCart({ ...product, price }, quantity);
    };

    const visibleItems = carousel.items
        .filter(
            (item) =>
                item.storeProduct.stock > 0
        )
        .sort((a, b) => a.position - b.position);

    if (visibleItems.length === 0) return null;

    return (
        <CarouselSection>
            <CarouselHeader>
                <CarouselTitle>
                    {normalWords.map((word, index) => (
                        <span key={`normal-${index}`}>{word} </span>
                    ))}

                    <strong>
                        {strongWords.join(" ")}
                    </strong>
                </CarouselTitle>
            </CarouselHeader>

            <CarouselTrackWrapper>
                <NavButton direction="left" onClick={() => scroll("left")} aria-label="Anterior">
                    <FontAwesomeIcon icon={faChevronLeft as any} />
                </NavButton>

                <CarouselTrack ref={trackRef}>
                    {visibleItems.map((item) => {
                        const sp = item.storeProduct;
                        const product = {
                            ...sp.product,
                            id: sp.id,
                            price: sp.price,
                            stock: sp.stock,
                            enabled: true,
                        };
                        return (
                            <ProductCard
                                key={item.id}
                                product={product}
                                image={sp.product.image || placeholder_products}
                                onAdd={handleAddProduct}
                                editablePrice={false}
                                enableDetailView={true}
                            />
                        );
                    })}
                </CarouselTrack>

                <NavButton direction="right" onClick={() => scroll("right")} aria-label="Próximo">
                    <FontAwesomeIcon icon={faChevronRight as any} />
                </NavButton>
            </CarouselTrackWrapper>
        </CarouselSection>
    );
}
