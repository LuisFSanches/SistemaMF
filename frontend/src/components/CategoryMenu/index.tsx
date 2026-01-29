import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import categoryService from "../../services/categoryService";
import { ICategory } from "../../interfaces/ICategory";
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

interface CategoryMenuProps {
    storeSlug: string;
    selectedCategorySlug?: string;
}

export function CategoryMenu({ storeSlug, selectedCategorySlug }: CategoryMenuProps) {
    const navigate = useNavigate();
    const [categories, setCategories] = useState<ICategory[]>([]);
    const [loading, setLoading] = useState(true);
    const [showLeftArrow, setShowLeftArrow] = useState(false);
    const [showRightArrow, setShowRightArrow] = useState(false);
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        loadCategories();
    }, []);

    const loadCategories = async () => {
        try {
            const data = await categoryService.getAllCategories();
            setCategories(data);
        } catch (error) {
            console.error('Erro ao carregar categorias:', error);
        } finally {
            setLoading(false);
        }
    };

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

    const handleCategoryClick = (categorySlug: string) => {
        navigate(`/${storeSlug}/categoria/${categorySlug}`);
    };

    const handleAllProductsClick = () => {
        navigate(`/${storeSlug}`);
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
                        $active={!selectedCategorySlug}
                        data-active={!selectedCategorySlug}
                        onClick={handleAllProductsClick}
                    >
                        <CategoryImage src={allCategories} alt="Todos os Produtos" />
                        <CategoryName>Todos os Produtos</CategoryName>
                    </CategoryItem>
                    {categories.map((category) => (
                        <CategoryItem
                            key={category.id}
                            $active={selectedCategorySlug === category.slug}
                            data-active={selectedCategorySlug === category.slug}
                            onClick={() => handleCategoryClick(category.slug)}
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
