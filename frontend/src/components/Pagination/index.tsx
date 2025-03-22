import React from 'react';
import { PageButton, PaginationContainer } from './style';

interface PaginationProps {
    currentPage: number;
    total: number;
    pageSize: number;
    onPageChange: (page: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({ currentPage, total, pageSize, onPageChange }) => {
    const handlePrev = () => onPageChange(currentPage - 1);
    const handleNext = () => onPageChange(currentPage + 1);
    const totalPages = Math.ceil(total / pageSize);

    const renderPageNumbers = () => {
        const pages = [];
        const maxVisiblePages = 5;

        if (totalPages <= maxVisiblePages) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            if (currentPage <= 3) {
                pages.push(1, 2, 3, 4, 5, '...');
            } else if (currentPage >= totalPages - 2) {
                pages.push(1, '...', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
            } else {
                pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
            }
        }

    return pages.map((page, index) => (
        <PageButton
            key={index}
            active={page === currentPage}
            onClick={() => typeof page === 'number' && onPageChange(page)}
            disabled={typeof page !== 'number'}
        >
            {page}
        </PageButton>
    ));
};

    return (
        <PaginationContainer>
            <PageButton onClick={handlePrev} disabled={currentPage === 1}>
                Anterior
            </PageButton>

            {renderPageNumbers()}

            <PageButton onClick={handleNext} disabled={currentPage === totalPages}>
                Próximo
            </PageButton>
        </PaginationContainer>
    );
};
