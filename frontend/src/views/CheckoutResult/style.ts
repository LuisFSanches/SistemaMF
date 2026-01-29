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
    max-width: 800px;
    margin: 0 auto;
    padding: 40px 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
`;

export const ResultCard = styled.div`
    width: 100%;
    background: white;
    border-radius: 16px;
    padding: 40px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
    text-align: center;

    @media (max-width: 768px) {
        padding: 24px;
    }
`;

export const IconWrapper = styled.div<{ status: 'success' | 'failure' | 'pending' }>`
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
            case 'success':
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

export const Title = styled.h1<{ status: 'success' | 'failure' | 'pending' }>`
    font-size: 28px;
    margin-bottom: 16px;
    font-family: "Poppins", sans-serif;
    
    ${({ status }) => {
        switch (status) {
            case 'success':
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
    margin-bottom: 24px;
    line-height: 1.6;

    @media (max-width: 768px) {
        font-size: 14px;
    }
`;

export const OrderInfo = styled.div`
    background: #f9f9f9;
    border-radius: 12px;
    padding: 20px;
    margin-bottom: 24px;
`;

export const OrderInfoRow = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 8px 0;
    border-bottom: 1px solid #e0e0e0;

    &:last-child {
        border-bottom: none;
    }

    span:first-child {
        color: #666;
    }

    span:last-child {
        font-weight: 600;
        color: #333;
    }
`;

export const ButtonsContainer = styled.div`
    display: flex;
    gap: 16px;
    flex-wrap: wrap;
    justify-content: center;

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

export const CountdownText = styled.p`
    margin-top: 20px;
    font-size: 14px;
    color: #666;
`;
