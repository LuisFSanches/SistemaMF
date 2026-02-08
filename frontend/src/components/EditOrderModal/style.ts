import styled from "styled-components";

export const STATUS_COLORS: Record<string, { primary: string; secondary: string }> = {
    "OPENED": { primary: "#f4d47c", secondary: "#e6c56a" },
    "WAITING_FOR_CLIENT": { primary: "#f97316", secondary: "#ea580c" },
    "IN_PROGRESS": { primary: "#377BD1", secondary: "#2563eb" },
    "IN_DELIVERY": { primary: "#6aa84f", secondary: "#16a34a" },
    "DONE": { primary: "#33CC95", secondary: "#10b981" },
    "CANCELED": { primary: "#E52E40", secondary: "#dc2626" },
    "PENDING_PAYMENT": { primary: "#a855f7", secondary: "#9333ea" },
};

export const ModernModalHeader = styled.div<{ statusColor?: { primary: string; secondary: string } }>`
    background: white;
    padding: 1rem;
    margin: -2rem -2rem 1rem -2rem;
    border-radius: 1.5rem 1.5rem 0 0;
    color: white;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);

    .header-content {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 1rem;
    }

    .header-left {
        display: flex;
        align-items: center;
        gap: 1rem;
    }

    .icon-container {
        background: rgba(255, 255, 255, 0.2);
        backdrop-filter: blur(10px);
        padding: 0.75rem;
        border-radius: 1rem;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.5rem;

        svg {
            color: #666666;
        }
    }

    .header-title {
        display: flex;
        flex-direction: column;
        gap: 0.25rem;

        h2 {
            margin: 0;
            font-size: 1.5rem;
            font-weight: 600;
        }

        .order-code {
            color:#666666;
            font-size: 0.875rem;
            opacity: 0.9;
        }
    }

    .status-badge {
        background: ${props => props.statusColor ? 
                `linear-gradient(135deg, ${props.statusColor.primary},
                ${props.statusColor.secondary})` : 'var(--primary-color)'};
        color: #000000;
        padding: 0.5rem 1rem;
        border-radius: 2rem;
        font-size: 0.875rem;
        font-weight: 600;
        display: flex;
        align-items: center;
        gap: 0.5rem;
        margin-right: 30px;
    }
`;

export const Section = styled.div`
    background: white;
    border-radius: 1rem;
    padding: 1rem;
    margin-bottom: 1.5rem;
    border: 1px solid #f0f0f0;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
    transition: all 0.2s ease;

    &:hover {
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.07);
    }
`;

export const SectionHeader = styled.div`
    display: flex;
    align-items: center;
    gap: 0.75rem;
    margin-bottom: 1.25rem;
    padding-bottom: 0.75rem;
    border-bottom: 2px solid #f5f5f5;

    .section-icon {
        background: linear-gradient(135deg, var(--primary-color), #ec4899);
        color: white;
        padding: 0.625rem;
        border-radius: 0.75rem;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.125rem;
    }

    h3 {
        margin: 0;
        font-size: 1.125rem;
        font-weight: 600;
        color: var(--text-body);
    }
`;

export const ProductCard = styled.div`
    background: #fafafa;
    border: 2px solid #f0f0f0;
    border-radius: 1rem;
    padding: 1rem;
    margin-bottom: 0.75rem;
    transition: all 0.2s ease;
    position: relative;

    &:hover {
        border-color: var(--primary-color);
        box-shadow: 0 4px 12px rgba(233, 85, 120, 0.1);

        .delete-button {
            opacity: 1;
        }
    }

    .product-row {
        display: grid;
        grid-template-columns: 80px 1fr 100px 120px;
        gap: 1rem;
        align-items: center;

        input {
            height: 3rem;
        }

        @media (max-width: 768px) {
            grid-template-columns: 1fr;
            gap: 0.75rem;
        }
    }

    .product-image {
        width: 80px;
        height: 80px;
        border-radius: 0.75rem;
        object-fit: cover;
        border: 2px solid #e0e0e0;
    }

    .product-image-placeholder {
        width: 80px;
        height: 80px;
        border-radius: 0.75rem;
        background: linear-gradient(135deg, #f5f5f5, #e0e0e0);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 2rem;
        color: #999;
    }

    .delete-button {
        position: absolute;
        top: 0.5rem;
        right: 0.5rem;
        background: #dc3545;
        color: white;
        border: none;
        border-radius: 50%;
        width: 2rem;
        height: 2rem;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        opacity: 0;
        transition: all 0.2s ease;
        font-size: 1rem;

        &:hover {
            background: #c82333;
            transform: scale(1.1);
        }

        @media (max-width: 768px) {
            opacity: 1;
        }
    }

    .suggestion-box {
        position: absolute;
        top: calc(100% + 0.5rem);
        left: 0;
        right: 0;
        background: white;
        border: 1px solid #e0e0e0;
        border-radius: 0.75rem;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
        max-height: 200px;
        overflow-y: auto;
        z-index: 1000;
        list-style: none;
        padding: 0;
        margin: 0;

        li {
            padding: 0.75rem 1rem;
            cursor: pointer;
            transition: all 0.15s ease;
            border-bottom: 1px solid #f5f5f5;

            &:last-child {
                border-bottom: none;
            }

            &:hover {
                background: var(--light-background);
                color: var(--primary-color);
            }
        }
    }
`;

export const AddProductButton = styled.button`
    width: 100%;
    padding: 1rem;
    background: linear-gradient(135deg, var(--primary-color), #ec4899);
    color: white;
    border: none;
    border-radius: 0.75rem;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;

    &:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 16px rgba(233, 85, 120, 0.3);
    }

    &:active {
        transform: translateY(0);
    }
`;

export const GridRow = styled.div`
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 1.5rem;

    &.price-row {
        grid-template-columns: repeat(4, 1fr);
        margin-bottom: 1.5rem;
    }

    &.order-information {
        grid-template-columns: repeat(3, 1fr);
    }

    .grid-container {
        display: flex;
        flex-direction: column;

        textarea {
            min-height: 100px;
        }
    }

    @media (max-width: 768px) {
        grid-template-columns: 1fr;
    }
`;

export const ValueCard = styled.div<{ highlight?: boolean }>`
    background: ${props => props.highlight 
        ? 'linear-gradient(135deg, var(--primary-color), #ec4899)' 
        : '#fafafa'};
    color: ${props => props.highlight ? 'white' : 'var(--text-body)'};
    padding: 1rem;
    border-radius: 0.75rem;
    border: 2px solid ${props => props.highlight ? 'transparent' : '#f0f0f0'};
    transition: all 0.2s ease;

    &:hover {
        transform: translateY(-2px);
        box-shadow: ${props => props.highlight 
            ? '0 8px 16px rgba(233, 85, 120, 0.3)' 
            : '0 4px 8px rgba(0, 0, 0, 0.1)'};
    }

    .value-label {
        font-size: 0.875rem;
        opacity: ${props => props.highlight ? 0.95 : 0.7};
        margin-bottom: 0.25rem;
    }

    .value-amount {
        font-size: 1.5rem;
        font-weight: 700;
    }
`;

export const SelectWithEmoji = styled.select`
    width: 100%;
    padding: 0.75rem 1rem;
    border: 2px solid #f0f0f0;
    border-radius: 0.75rem;
    font-size: 1rem;
    background: white;
    cursor: pointer;
    transition: all 0.2s ease;

    &:focus {
        outline: none;
        border-color: var(--primary-color);
        box-shadow: 0 0 0 3px rgba(233, 85, 120, 0.1);
    }

    &:hover {
        border-color: #e0e0e0;
    }
`;

export const CheckboxCard = styled.label<{ checked?: boolean }>`
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    padding: 1rem;
    background: ${props => props.checked ? 'var(--light-background)' : 'white'};
    border: 2px solid ${props => props.checked ? 'var(--primary-color)' : '#f0f0f0'};
    border-radius: 0.75rem;
    cursor: pointer;
    transition: all 0.2s ease;

    &:hover {
        border-color: var(--primary-color);
        transform: translateY(-2px);
        box-shadow: 0 4px 8px rgba(233, 85, 120, 0.1);
    }

    .checkbox-header {
        display: flex;
        align-items: center;
        gap: 0.75rem;
    }

    .checkbox-title {
        font-weight: 600;
        color: var(--text-body);
        font-size: 0.95rem;
    }

    .checkbox-description {
        font-size: 0.8rem;
        color: var(--text-light);
        margin-left: 2rem;
    }

    input[type="checkbox"] {
        width: 1.25rem;
        height: 1.25rem;
        cursor: pointer;
    }
`;

export const ModalFooter = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 1rem;
    padding: 1rem;
    margin: 0 -2rem -2rem -2rem;
    border-top: 2px solid #f5f5f5;
    background: white;
    position: sticky;
    bottom: -2rem;
    z-index: 10;
    box-shadow: 0 -4px 6px rgba(0, 0, 0, 0.05);
    border-radius: 0 0 1.5rem 1.5rem;

    @media (max-width: 768px) {
        flex-direction: column-reverse;
        
        button {
            width: 100%;
        }
    }
`;

export const DiscardButton = styled.button`
    background: transparent;
    color: #666;
    border: 2px solid #d0d0d0;
    padding: 0.875rem 2rem;
    border-radius: 0.75rem;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;

    &:hover {
        border-color: #999;
        color: #333;
        transform: translateY(-2px);
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    }

    &:active {
        transform: translateY(0);
    }
`;

export const CancelButton = styled.button`
    background: white;
    color: #dc3545;
    border: 2px solid #dc3545;
    padding: 0.875rem 2rem;
    border-radius: 0.75rem;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;

    &:hover {
        background: #dc3545;
        color: white;
        transform: translateY(-2px);
        box-shadow: 0 4px 8px rgba(220, 53, 69, 0.3);
    }

    &:active {
        transform: translateY(0);
    }
`;

export const SaveButton = styled.button`
    background: linear-gradient(135deg, var(--green), #28a745);
    color: white;
    border: none;
    padding: 0.875rem 2rem;
    border-radius: 0.75rem;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;
    display: flex;
    align-items: center;
    gap: 0.5rem;

    &:hover:not(:disabled) {
        transform: translateY(-2px);
        box-shadow: 0 8px 16px rgba(51, 204, 149, 0.3);
    }

    &:active:not(:disabled) {
        transform: translateY(0);
    }

    &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }
`;

export const EditClientButton = styled.button`
    background: linear-gradient(135deg, var(--primary-color), #ec4899);
    border: none;
    color: white;
    font-size: 0.875rem;
    font-weight: 600;
    cursor: pointer;
    padding: 0.5rem 1rem;
    margin-top: 0.5rem;
    border-radius: 0.5rem;
    transition: all 0.2s ease;

    &:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 8px rgba(233, 85, 120, 0.3);
    }
`;

export const TabsContainer = styled.div`
    display: flex;
    gap: 0.5rem;
    margin-bottom: 1rem;
    border-bottom: 2px solid #e4e4e4;
    overflow-x: auto;

    &::-webkit-scrollbar {
        height: 4px;
    }

    &::-webkit-scrollbar-thumb {
        background: var(--primary-color);
        border-radius: 2px;
    }
`;

export const Tab = styled.button<{ active: boolean }>`
    background: ${props => props.active 
        ? 'linear-gradient(135deg, var(--primary-color), #ec4899)' 
        : 'transparent'};
    color: ${props => props.active ? 'white' : 'var(--text-body)'};
    border: none;
    padding: 0.875rem 1.5rem;
    border-radius: 0.75rem 0.75rem 0 0;
    font-size: 0.95rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;
    white-space: nowrap;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    position: relative;

    ${props => !props.active && `
        &:hover {
            background: var(--light-background);
            color: var(--primary-color);
        }
    `}

    ${props => props.active && `
        box-shadow: 0 4px 12px rgba(233, 85, 120, 0.2);
    `}
`;

export const TabContent = styled.div<{ active: boolean }>`
    display: ${props => props.active ? 'block' : 'none'};
    animation: ${props => props.active ? 'fadeIn 0.3s ease' : 'none'};

    @keyframes fadeIn {
        from {
            opacity: 0;
            transform: translateY(10px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;
