import styled from 'styled-components';

export const Container = styled.div`
    width: 100%;
    min-height: 100vh;
    background: linear-gradient(135deg, #fef5f8 0%, #fff 100%);
    display: flex;
    flex-direction: column;
`;

export const Content = styled.main`
    flex: 1;
    max-width: 1200px;
    width: 100%;
    margin: 0 auto;
    padding: 0px 20px 40px 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 24px;

    @media (max-width: 768px) {
        gap: 16px;
    }
`;

export const ResultCard = styled.div`
    width: 100%;
    background: white;
    border-radius: 16px;
    padding: 10px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
    text-align: center;

    @media (max-width: 768px) {
        padding: 24px;
    }
`;

export const IconWrapper = styled.div<{ status: 'approved' | 'failure' | 'pending' }>`
    width: 100px;
    height: 100px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 24px;
    font-size: 48px;
    
    ${({ status }) => {
        switch (status) {
            case 'approved':
                return `
                    background: linear-gradient(135deg, #d4edda 0%, #c3e6cb 100%);
                    color: #28a745;
                `;
            case 'failure':
                return `
                    background: linear-gradient(135deg, #f8d7da 0%, #f5c6cb 100%);
                    color: #dc3545;
                `;
            case 'pending':
                return `
                    background: linear-gradient(135deg, #fff3cd 0%, #ffeeba 100%);
                    color: #ffc107;
                `;
        }
    }}
`;

export const Title = styled.h1<{ status: 'approved' | 'failure' | 'pending' }>`
    font-size: 28px;
    margin-bottom: 16px;
    font-family: "Poppins", sans-serif;
    
    ${({ status }) => {
        switch (status) {
            case 'approved':
                return `color: #28a745;`;
            case 'failure':
                return `color: #dc3545;`;
            case 'pending':
                return `color: #856404;`;
        }
    }}

    @media (max-width: 768px) {
        font-size: 22px;
    }
`;

export const Message = styled.p`
    font-size: 16px;
    color: #666;
    margin-bottom: 14px;
    line-height: 1.6;

    @media (max-width: 768px) {
        font-size: 14px;
    }
`;

export const ButtonsContainer = styled.div`
    display: flex;
    gap: 16px;
    flex-wrap: wrap;
    justify-content: center;
    margin-top: 8px;

    @media (max-width: 768px) {
        flex-direction: column;
    }
`;

export const PrimaryButton = styled.button`
    background: var(--primary-color);
    color: white;
    border: none;
    padding: 14px 32px;
    border-radius: 8px;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;

    &:hover {
        opacity: 0.9;
        transform: translateY(-2px);
    }

    @media (max-width: 768px) {
        width: 100%;
    }
`;

export const SecondaryButton = styled.button`
    background: transparent;
    color: var(--primary-color);
    border: 2px solid var(--primary-color);
    padding: 14px 32px;
    border-radius: 8px;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;

    &:hover {
        background: var(--primary-color);
        color: white;
    }

    @media (max-width: 768px) {
        width: 100%;
    }
`;

export const LoadingSpinner = styled.div`
    width: 50px;
    height: 50px;
    border: 4px solid #f3f3f3;
    border-top: 4px solid var(--primary-color);
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin: 20px auto;

    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
`;

// Seções de detalhes
export const DetailsSection = styled.div`
    width: 100%;
    background: white;
    border-radius: 16px;
    padding: 24px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);

    @media (max-width: 768px) {
        padding: 16px;
    }
`;

export const SectionHeader = styled.div`
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 20px;
    padding-bottom: 16px;
    border-bottom: 2px solid #f0f0f0;
`;

export const SectionIcon = styled.div`
    font-size: 24px;
    color: var(--primary-color);
`;

export const SectionTitle = styled.h2`
    font-size: 20px;
    font-weight: 600;
    color: #333;
    font-family: "Poppins", sans-serif;
    margin: 0;

    @media (max-width: 768px) {
        font-size: 18px;
    }
`;

// Itens do pedido
export const OrderItemsList = styled.div`
    display: flex;
    flex-direction: column;
    gap: 16px;
`;

export const OrderItem = styled.div`
    display: flex;
    gap: 16px;
    padding: 12px;
    background: #f9f9f9;
    border-radius: 8px;

    @media (max-width: 768px) {
        flex-direction: column;
    }
`;

export const ItemImage = styled.img`
    width: 80px;
    height: 80px;
    object-fit: cover;
    border-radius: 8px;
    flex-shrink: 0;

    @media (max-width: 768px) {
        width: 100%;
        height: 150px;
    }
`;

export const ItemImagePlaceholder = styled.div`
    width: 80px;
    height: 80px;
    background: linear-gradient(135deg, #e0e0e0 0%, #f0f0f0 100%);
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 32px;
    color: #999;
    flex-shrink: 0;

    @media (max-width: 768px) {
        width: 100%;
        height: 150px;
    }
`;

export const ItemDetails = styled.div`
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
`;

export const ItemName = styled.h3`
    font-size: 16px;
    font-weight: 600;
    color: #333;
    margin: 0 0 4px 0;
`;

export const ItemDescription = styled.p`
    font-size: 13px;
    color: #666;
    margin: 0 0 8px 0;
`;

export const ItemQuantityPrice = styled.div`
    display: flex;
    align-items: center;
    gap: 12px;
    font-size: 14px;
    color: #666;
`;

export const ItemTotal = styled.span`
    font-size: 16px;
    font-weight: 600;
    color: #333;
    margin-left: auto;
`;

// Resumo financeiro
export const FinancialSummary = styled.div`
    display: flex;
    flex-direction: column;
    gap: 12px;
    margin-top: 16px;
    padding-top: 16px;
    border-top: 2px solid #f0f0f0;
`;

export const FinancialRow = styled.div<{ isTotal?: boolean }>`
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: ${props => props.isTotal ? '18px' : '15px'};
    font-weight: ${props => props.isTotal ? '700' : '400'};
    color: ${props => props.isTotal ? '#333' : '#666'};

    ${props => props.isTotal && `
        padding-top: 12px;
        border-top: 2px solid #333;
        color: var(--primary-color);
    `}
`;

// Informações de entrega
export const DeliveryInfo = styled.div`
    display: flex;
    flex-direction: column;
    gap: 16px;
`;

export const InfoRow = styled.div`
    display: flex;
    flex-direction: column;
    gap: 4px;
`;

export const InfoLabel = styled.span`
    font-size: 13px;
    color: #999;
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: 0.5px;
`;

export const InfoValue = styled.span`
    font-size: 16px;
    color: #333;
    font-weight: 400;
    line-height: 1.5;
`;

export const InfoBadge = styled.span<{ type?: string }>`
    display: inline-block;
    padding: 4px 12px;
    border-radius: 20px;
    font-size: 13px;
    font-weight: 600;
    background: ${props => props.type === 'pickup' ? '#e3f2fd' : '#f3e5f5'};
    color: ${props => props.type === 'pickup' ? '#1976d2' : '#7b1fa2'};
`;

// Informações de pagamento
export const PaymentInfo = styled.div`
    display: flex;
    flex-direction: column;
    gap: 16px;
`;

export const PaymentMethodBadge = styled.div`
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 8px 16px;
    background: #f9f9f9;
    border: 2px solid #e0e0e0;
    border-radius: 8px;
    font-size: 16px;
    font-weight: 600;
    color: #333;
    width: fit-content;

    svg {
        font-size: 20px;
    }
`;

export const PaymentStatusBadge = styled.span<{ status: string }>`
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 6px 12px;
    border-radius: 20px;
    font-size: 14px;
    font-weight: 600;
    width: fit-content;
    
    ${({ status }) => {
        switch (status) {
            case 'approved':
                return `
                    background: #d4edda;
                    color: #28a745;
                `;
            case 'pending':
                return `
                    background: #fff3cd;
                    color: #856404;
                `;
            default:
                return `
                    background: #f8d7da;
                    color: #dc3545;
                `;
        }
    }}
`;

// Observações e mensagem do cartão
export const NotesSection = styled.div`
    background: #fff8e1;
    border-left: 4px solid #ffc107;
    padding: 16px;
    border-radius: 8px;
    margin-top: 16px;
`;

export const NotesTitle = styled.h4`
    font-size: 14px;
    font-weight: 600;
    color: #856404;
    margin: 0 0 8px 0;
    text-transform: uppercase;
    letter-spacing: 0.5px;
`;

export const NotesText = styled.p`
    font-size: 15px;
    color: #333;
    margin: 0;
    line-height: 1.6;
`;

export const CardMessageSection = styled.div`
    background: linear-gradient(135deg, #fff 0%, #fef5f8 100%);
    border: 2px solid var(--primary-color);
    padding: 20px;
    border-radius: 12px;
    margin-top: 16px;
`;

export const CardMessageHeader = styled.div`
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 12px;
    color: var(--primary-color);
    font-size: 18px;
    font-weight: 600;
`;

export const CardMessageText = styled.p`
    font-size: 15px;
    color: #333;
    font-style: italic;
    margin: 0 0 12px 0;
    line-height: 1.6;
    padding: 12px;
    background: white;
    border-radius: 8px;
`;

export const CardMessageSignature = styled.div`
    text-align: right;
    font-size: 14px;
    color: #666;
    
    strong {
        color: #333;
    }
`;

export const WhatsAppButton = styled.button`
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    background: #25D366;
    color: white;
    border: none;
    padding: 14px 32px;
    border-radius: 8px;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;

    &:hover {
        background: #128C7E;
        transform: translateY(-2px);
    }

    @media (max-width: 768px) {
        width: 100%;
    }

    svg {
        font-size: 20px;
    }
`;

