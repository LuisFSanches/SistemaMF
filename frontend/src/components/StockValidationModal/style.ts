import styled from "styled-components";

export const ModalContainer = styled.div`
    background: white;
    border-radius: 12px;
    padding: 0;
    max-width: 600px;
    width: 100%;
    max-height: 80vh;
    overflow-y: auto;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
`;

export const ModalHeader = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 24px 28px;
    border-bottom: 1px solid #e5e7eb;
    background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
    border-radius: 12px 12px 0 0;

    h2 {
        font-size: 22px;
        font-weight: 700;
        color: #1e293b;
        margin: 0;
        display: flex;
        align-items: center;
        gap: 12px;

        svg {
            color: #f59e0b;
            font-size: 24px;
        }
    }
`;

export const CloseButton = styled.button`
    background: transparent;
    border: none;
    font-size: 24px;
    color: #64748b;
    cursor: pointer;
    padding: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s;
    border-radius: 6px;

    &:hover {
        background: rgba(0, 0, 0, 0.05);
        color: #1e293b;
    }
`;

export const ModalBody = styled.div`
    padding: 24px 28px;
`;

export const IntroText = styled.p`
    font-size: 15px;
    color: #475569;
    line-height: 1.6;
    margin: 0 0 20px 0;
    padding: 16px;
    background: #fef3c7;
    border-left: 4px solid #f59e0b;
    border-radius: 6px;
`;

export const InvalidItemsList = styled.div`
    display: flex;
    flex-direction: column;
    gap: 16px;
    margin-bottom: 24px;
`;

export const InvalidItemCard = styled.div`
    border: 1px solid #e5e7eb;
    border-radius: 10px;
    padding: 16px;
    background: #fafafa;
    transition: all 0.2s;

    &:hover {
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
    }
`;

export const ItemHeader = styled.div`
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    margin-bottom: 12px;
`;

export const ItemName = styled.h3`
    font-size: 16px;
    font-weight: 600;
    color: #1e293b;
    margin: 0;
    flex: 1;
`;

export const StatusBadge = styled.span<{ type: 'unavailable' | 'out_of_stock' }>`
    padding: 4px 12px;
    border-radius: 20px;
    font-size: 12px;
    font-weight: 600;
    white-space: nowrap;
    
    ${props => props.type === 'unavailable' && `
        background: #fee2e2;
        color: #991b1b;
    `}
    
    ${props => props.type === 'out_of_stock' && `
        background: #fef3c7;
        color: #92400e;
    `}
`;

export const ItemDetails = styled.div`
    display: flex;
    flex-direction: column;
    gap: 6px;
    font-size: 14px;
    color: #64748b;

    div {
        display: flex;
        align-items: center;
        gap: 8px;

        svg {
            width: 16px;
            color: #94a3b8;
        }

        strong {
            color: #1e293b;
        }
    }
`;

export const ActionButtons = styled.div`
    display: flex;
    gap: 12px;
    justify-content: flex-end;
    padding-top: 20px;
    border-top: 1px solid #e5e7eb;
    margin-top: 20px;
`;

export const CancelButton = styled.button`
    background: #f1f5f9;
    color: #475569;
    border: 1px solid #e2e8f0;
    padding: 12px 24px;
    border-radius: 8px;
    font-size: 15px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
    display: flex;
    align-items: center;
    gap: 8px;

    &:hover {
        background: #e2e8f0;
        border-color: #cbd5e1;
    }

    svg {
        font-size: 16px;
    }
`;

export const ConfirmButton = styled.button`
    background: var(--primary-color);
    color: white;
    border: none;
    padding: 12px 24px;
    border-radius: 8px;
    font-size: 15px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
    display: flex;
    align-items: center;
    gap: 8px;

    &:hover {
        background: var(--primary-hover);
        transform: translateY(-1px);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }

    svg {
        font-size: 16px;
    }
`;
