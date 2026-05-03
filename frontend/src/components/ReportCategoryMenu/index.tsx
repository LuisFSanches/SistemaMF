import { useState, useRef, useEffect } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { useCategories } from "../../contexts/CategoriesContext";
import {
    MenuContainer,
    CarouselWrapper,
    NavigationButton,
    CategoryList,
    CategoryItem,
    CategoryImage,
    CategoryName,
    CategoryImagePlaceholder
} from "./style";
import allCategories from "../../assets/images/all_categories.png";

interface ReportCategoryMenuProps {
    selectedCategoryId?: string;
    onCategoryChange: (categoryId: string | undefined) => void;
}

export function ReportCategoryMenu({ selectedCategoryId, onCategoryChange }: ReportCategoryMenuProps) {
    const { categories, loading } = useCategories();
    const [showLeftArrow, setShowLeftArrow] = useState(false);
    const [showRightArrow, setShowRightArrow] = useState(false);
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    const checkScrollButtons = () => {
        if (scrollContainerRef.current) {
            const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
            setShowLeftArrow(scrollLeft > 0);
            setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10);
        }
    };

    const scrollLeft = () => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollBy({ left: -300, behavior: 'smooth' });
        }
    };

    const scrollRight = () => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollBy({ left: 300, behavior: 'smooth' });
        }
    };

    useEffect(() => {
        checkScrollButtons();
        window.addEventListener('resize', checkScrollButtons);
        return () => window.removeEventListener('resize', checkScrollButtons);
    }, [categories]);

    const handleCategoryClick = (categoryId: string) => {
        onCategoryChange(categoryId);
    };

    const handleAllProductsClick = () => {
        onCategoryChange(undefined);
    };

    if (loading || categories.length === 0) {
        return null;
    }

    return (
        <MenuContainer>
            {showLeftArrow && (
                <NavigationButton $position="left" onClick={scrollLeft}>
                    <FontAwesomeIcon icon={faChevronLeft} />
                </NavigationButton>
            )}
            
            <CarouselWrapper
                ref={scrollContainerRef}
                onScroll={checkScrollButtons}
            >
                <CategoryList>
                    <CategoryItem
                        $active={!selectedCategoryId}
                        data-active={!selectedCategoryId}
                        onClick={handleAllProductsClick}
                    >
                        <CategoryImage src={allCategories} alt="Todas as Categorias" />
                        <CategoryName>Todas as Categorias</CategoryName>
                    </CategoryItem>
                    {categories.map((category) => (
                        <CategoryItem
                            key={category.id}
                            $active={selectedCategoryId === category.id}
                            data-active={selectedCategoryId === category.id}
                            onClick={() => handleCategoryClick(category.id)}
                        >
                            {category.image ? (
                                <CategoryImage src={category.image} alt={category.name} />
                            ) : (
                                <CategoryImagePlaceholder>
                                    <span>{category.name.charAt(0)}</span>
                                </CategoryImagePlaceholder>
                            )}
                            <CategoryName>{category.name}</CategoryName>
                        </CategoryItem>
                    ))}
                </CategoryList>
            </CarouselWrapper>

            {showRightArrow && (
                <NavigationButton $position="right" onClick={scrollRight}>
                    <FontAwesomeIcon icon={faChevronRight} />
                </NavigationButton>
            )}
        </MenuContainer>
    );
}
