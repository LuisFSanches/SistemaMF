import styled from 'styled-components';

export const Container = styled.div`
    width: 100%;
    min-height: 100vh;
    background: linear-gradient(135deg, #fef5f8 0%, #fff 100%);
    padding-bottom: 40px;
`;

// Stepper
export const StepperContainer = styled.div`
    width: 100%;
    background: white;
    padding-bottom: 24px;
    padding-top: 8px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    position: sticky;
    top: 0;
    z-index: 100;

    @media (max-width: 768px) {
        padding: 16px;
    }
`;

export const StepperWrapper = styled.div`
    max-width: 600px;
    margin: 0 auto;
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: relative;

    &::before {
        content: '';
        position: absolute;
        top: 20px;
        left: 60px;
        right: 60px;
        height: 2px;
        background: #E5E7EB;
        z-index: 0;
    }

    @media (max-width: 768px) {
        &::before {
            left: 40px;
            right: 40px;
        }
    }
`;

export const Step = styled.div<{ active: boolean; completed: boolean; clickable?: boolean }>`
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    position: relative;
    z-index: 1;
    cursor: ${({ clickable }) => (clickable ? 'pointer' : 'default')};
    transition: all 0.3s ease;

    &:hover {
        ${({ clickable }) => clickable && `
            transform: translateY(-2px);
        `}
    }

    @media (max-width: 768px) {
        gap: 4px;
    }
`;

export const StepCircle = styled.div<{ active: boolean; completed: boolean }>`
    width: 40px;
    height: 40px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 600;
    font-size: 1rem;
    background: ${({ active, completed }) =>
        completed ? '#EC4899' : active ? '#EC4899' : 'white'};
    color: ${({ active, completed }) =>
        completed || active ? 'white' : '#9CA3AF'};
    border: 2px solid ${({ active, completed }) =>
        completed ? '#EC4899' : active ? '#EC4899' : '#E5E7EB'};
    transition: all 0.3s ease;

    @media (max-width: 768px) {
        width: 32px;
        height: 32px;
        font-size: 0.875rem;
    }
`;

export const StepLabel = styled.div<{ active: boolean }>`
    font-size: 0.875rem;
    font-weight: ${({ active }) => (active ? '600' : '500')};
    color: ${({ active }) => (active ? '#333' : '#6B7280')};
    text-align: center;
    white-space: nowrap;

    @media (max-width: 768px) {
        font-size: 0.75rem;
    }
`;

export const StepSubLabel = styled.div`
    font-size: 0.75rem;
    color: #9CA3AF;
    text-align: center;

    @media (max-width: 768px) {
        font-size: 0.65rem;
    }
`;

export const Content = styled.main`
    max-width: 1440px;
    margin: 0 auto;
    padding: 20px 20px;
    display: grid;
    grid-template-columns: 1fr 400px;
    gap: 20px;

    @media (max-width: 1024px) {
        grid-template-columns: 1fr;
    }

    @media (max-width: 768px) {
        display: flex;
        flex-direction: column;
    }
`;

export const CartSection = styled.div`
    background: white;
    border-radius: 16px;
    padding: 25px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);

    @media (max-width: 768px) {
        padding: 15px;
    }
`;

export const SectionTitle = styled.h2`
    color: var(--primary-color);
    font-size: 24px;
    margin-bottom: 20px;
    display: flex;
    align-items: center;
    gap: 10px;

    @media (max-width: 768px) {
        font-size: 20px;
    }
`;

export const CartItem = styled.div`
    display: flex;
    gap: 16px;
    padding: 16px;
    border: 1px solid #f0f0f0;
    border-radius: 12px;
    margin-bottom: 16px;
    transition: all 0.3s ease;

    &:hover {
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }
`;

export const CartItemImage = styled.img`
    width: 80px;
    height: 80px;
    object-fit: cover;
    border-radius: 8px;

    @media (max-width: 768px) {
        width: 60px;
        height: 60px;
    }
`;

export const CartItemInfo = styled.div`
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
`;

export const CartItemName = styled.h4`
    color: #333;
    font-size: 16px;
    margin-bottom: 8px;
`;

export const CartItemPrice = styled.p`
    color: var(--primary-color);
    font-size: 18px;
    font-weight: bold;
`;

export const CartItemActions = styled.div`
    display: flex;
    align-items: center;
    gap: 12px;
`;

export const QuantityControl = styled.div`
    display: flex;
    align-items: center;
    gap: 8px;
    border: 1px solid #ddd;
    border-radius: 8px;
    padding: 4px;
`;

export const QuantityButton = styled.button`
    background: var(--primary-color);
    color: white;
    border: none;
    width: 28px;
    height: 28px;
    border-radius: 6px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s ease;

    &:hover {
        background: #d93f7c;
    }

    &:disabled {
        background: #ccc;
        cursor: not-allowed;
    }
`;

export const QuantityDisplay = styled.span`
    min-width: 30px;
    text-align: center;
    font-weight: 600;
`;

export const RemoveButton = styled.button`
    background: transparent;
    border: none;
    color: #ff4444;
    cursor: pointer;
    font-size: 20px;
    padding: 4px;
    transition: all 0.2s ease;

    &:hover {
        transform: scale(1.1);
        color: #cc0000;
    }
`;

export const EmptyCart = styled.div`
    text-align: center;
    padding: 60px 20px;
    color: #999;

    svg {
        font-size: 64px;
        margin-bottom: 20px;
        color: #ddd;
    }

    h3 {
        font-size: 24px;
        margin-bottom: 10px;
        color: #666;
    }

    p {
        font-size: 16px;
        margin-bottom: 24px;
    }
`;

export const OrderSummary = styled.div`
    background: white;
    border-radius: 16px;
    padding: 25px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
    height: fit-content;
    position: sticky;
    top: 100px;

    @media (max-width: 1024px) {
        position: relative;
        top: 0;
    }

    @media (max-width: 768px) {
        padding: 15px;
    }
`;

export const SummaryRow = styled.div`
    display: flex;
    justify-content: space-between;
    margin-bottom: 16px;
    font-size: 16px;

    &.total {
        padding-top: 16px;
        border-top: 2px solid #f0f0f0;
        font-size: 20px;
        font-weight: bold;
        color: var(--primary-color);
        margin-bottom: 24px;
    }
`;

export const CheckoutButton = styled.button`
    width: 100%;
    padding: 16px;
    background: #d93f7c;
    color: white;
    border: none;
    border-radius: 12px;
    font-size: 18px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;

    &:hover {
        background: #d93f7c;
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(236, 72, 153, 0.3);
    }

    &:disabled {
        background: #ccc;
        cursor: not-allowed;
        transform: none;
    }
`;

export const ObservationsField = styled.div`
    margin-top: 24px;
    padding-top: 24px;
    border-top: 2px solid #f0f0f0;

    p {
        margin-top: 8px;
        font-size: 14px;
        font-style: italic;
        color: #999B9B;
        font-weight: 600;
    }
`;

export const Textarea = styled.textarea`
    width: 100%;
    min-height: 100px;
    padding: 12px;
    border: 1px solid #ddd;
    border-radius: 8px;
    font-size: 14px;
    font-family: inherit;
    resize: vertical;
    transition: all 0.3s ease;

    &:focus {
        outline: none;
        border-color: var(--primary-color);
        box-shadow: 0 0 0 3px rgba(236, 72, 153, 0.1);
    }

    &::placeholder {
        color: #999;
    }
`;
