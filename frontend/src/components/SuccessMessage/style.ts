import styled, { keyframes } from 'styled-components';

const slideIn = keyframes`
    from {
        transform: translateX(400px);
        opacity: 0;
    }
    to {
        transform: translateX(0);
        opacity: 1;
    }
`;

const slideOut = keyframes`
    from {
        transform: translateX(0);
        opacity: 1;
    }
    to {
        transform: translateX(400px);
        opacity: 0;
    }
`;

export const Container = styled.div<{ $isVisible: boolean }>`
    position: fixed;
    top: 20px;
    right: 20px;
    z-index: 10000;
    
    display: flex;
    align-items: center;
    gap: 12px;
    
    background: #d1fae5;
    border: 1px solid #34d399;
    border-radius: 8px;
    padding: 16px 24px;
    min-width: 300px;
    max-width: 500px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    
    animation: ${props => props.$isVisible ? slideIn : slideOut} 0.3s ease-out forwards;
    
    .icon {
        font-size: 24px;
        color: #059669;
        flex-shrink: 0;
    }
    
    .content {
        flex: 1;
        
        p {
            margin: 0;
            color: #065f46;
            font-size: 14px;
            font-weight: 600;
            line-height: 1.4;
        }
    }
    
    .close-button {
        background: none;
        border: none;
        color: #059669;
        cursor: pointer;
        font-size: 20px;
        padding: 0;
        width: 24px;
        height: 24px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 4px;
        transition: background 0.2s;
        flex-shrink: 0;
        
        &:hover {
            background: rgba(5, 150, 105, 0.1);
        }
    }
`;
