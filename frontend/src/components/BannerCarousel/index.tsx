import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft, faChevronRight } from "@fortawesome/free-solid-svg-icons";
import {
    BannerCarouselContainer,
    BannerSlide,
    Banner,
    CarouselButton,
    CarouselDots,
    CarouselDot
} from "./style";

interface BannerCarouselProps {
    banners: string[];
    storeName?: string;
}

export function BannerCarousel({ banners, storeName = "Loja" }: BannerCarouselProps) {
    const [currentSlide, setCurrentSlide] = useState(0);

    // Auto-play do carousel
    useEffect(() => {
        if (banners.length > 1) {
            const interval = setInterval(() => {
                setCurrentSlide((prev) => (prev + 1) % banners.length);
            }, 5000);
            return () => clearInterval(interval);
        }
    }, [banners.length]);

    const nextSlide = () => {
        setCurrentSlide((prev) => (prev + 1) % banners.length);
    };

    const prevSlide = () => {
        setCurrentSlide((prev) => (prev - 1 + banners.length) % banners.length);
    };

    const goToSlide = (index: number) => {
        setCurrentSlide(index);
    };

    if (banners.length === 0) {
        return null;
    }

    return (
        <BannerCarouselContainer>
            {banners.map((banner, index) => (
                <BannerSlide key={index} isActive={currentSlide === index}>
                    <Banner src={banner} alt={`${storeName} Banner ${index + 1}`} />
                </BannerSlide>
            ))}
            
            {banners.length > 1 && (
                <>
                    <CarouselButton direction="left" onClick={prevSlide}>
                        <FontAwesomeIcon icon={faChevronLeft as any} />
                    </CarouselButton>
                    <CarouselButton direction="right" onClick={nextSlide}>
                        <FontAwesomeIcon icon={faChevronRight as any} />
                    </CarouselButton>
                    
                    <CarouselDots>
                        {banners.map((_, index) => (
                            <CarouselDot
                                key={index}
                                isActive={currentSlide === index}
                                onClick={() => goToSlide(index)}
                            />
                        ))}
                    </CarouselDots>
                </>
            )}
        </BannerCarouselContainer>
    );
}
