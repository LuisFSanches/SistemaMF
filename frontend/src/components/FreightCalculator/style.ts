import styled, { css, keyframes } from 'styled-components';

const spin = keyframes`
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
`;

const fadeIn = keyframes`
    from { opacity: 0; transform: translateY(-6px); }
    to { opacity: 1; transform: translateY(0); }
`;

export const Wrapper = styled.div<{ compact?: boolean }>`
    background: ${({ compact }) => (compact ? 'transparent' : '#F9FAFB')};
    border: ${({ compact }) => (compact ? 'none' : '1px solid #E5E7EB')};
    border-radius: 12px;
    padding: ${({ compact }) => (compact ? '0' : '16px')};
    display: flex;
    flex-direction: column;
    gap: 12px;
`;

export const Title = styled.h3<{ compact?: boolean }>`
    font-size: ${({ compact }) => (compact ? '15px' : '16px')};
    font-weight: 600;
    color: #111827;
    margin: 0;
    display: flex;
    align-items: center;
    gap: 8px;

    svg {
        color: var(--primary-color);
        font-size: ${({ compact }) => (compact ? '14px' : '16px')};
    }
`;

export const CepForm = styled.div`
    display: flex;
    flex-direction: column;
    gap: 8px;
    animation: ${fadeIn} 0.2s ease;
`;

export const CepInputWrapper = styled.div`
    display: flex;
    gap: 8px;
    align-items: stretch;
`;

export const CepInput = styled.input<{ hasError?: boolean }>`
    flex: 1;
    padding: 10px 14px;
    border: 1.5px solid ${({ hasError }) => (hasError ? '#EF4444' : '#D1D5DB')};
    border-radius: 8px;
    font-size: 15px;
    font-family: inherit;
    color: #111827;
    background: white;
    transition: border-color 0.2s ease, box-shadow 0.2s ease;
    letter-spacing: 1px;

    &:focus {
        outline: none;
        border-color: var(--primary-color);
        box-shadow: 0 0 0 3px rgba(236, 72, 153, 0.1);
    }

    &::placeholder {
        color: #9CA3AF;
        letter-spacing: 0;
    }

    &:disabled {
        background: #F3F4F6;
        cursor: not-allowed;
    }
`;

export const CepButton = styled.button`
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 10px 16px;
    background: var(--primary-color);
    color: white;
    border: none;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    white-space: nowrap;
    transition: all 0.2s ease;

    &:hover:not(:disabled) {
        background: #d93f7c;
        transform: translateY(-1px);
        box-shadow: 0 4px 10px rgba(236, 72, 153, 0.25);
    }

    &:disabled {
        background: #9CA3AF;
        cursor: not-allowed;
        transform: none;
        box-shadow: none;
    }
`;

export const AddressDisplay = styled.div`
    display: flex;
    align-items: flex-start;
    gap: 6px;
    font-size: 13px;
    color: #6B7280;
    animation: ${fadeIn} 0.2s ease;

    svg {
        color: var(--primary-color);
        margin-top: 2px;
        flex-shrink: 0;
    }
`;

export const AddressLine = styled.span`
    line-height: 1.4;
`;

export const ResultBox = styled.div`
    background: white;
    border: 1.5px solid #D1FAE5;
    border-radius: 10px;
    padding: 14px 16px;
    display: flex;
    flex-direction: column;
    gap: 8px;
    position: relative;
    animation: ${fadeIn} 0.3s ease;
`;

export const ResultRow = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 14px;
`;

export const ResultLabel = styled.span`
    color: #6B7280;
    font-weight: 500;
`;

export const ResultValue = styled.span`
    color: #111827;
    font-weight: 600;

    &.highlight {
        color: var(--primary-color);
        font-size: 16px;
    }
`;

export const ErrorBox = styled.div`
    display: flex;
    align-items: flex-start;
    gap: 8px;
    background: #FEF2F2;
    border: 1px solid #FCA5A5;
    border-radius: 8px;
    padding: 10px 12px;
    animation: ${fadeIn} 0.2s ease;

    svg {
        color: #EF4444;
        margin-top: 2px;
        flex-shrink: 0;
    }
`;

export const ErrorText = styled.span`
    font-size: 13px;
    color: #B91C1C;
    line-height: 1.4;
`;

export const ChangeButton = styled.button`
    display: flex;
    align-items: center;
    gap: 6px;
    background: none;
    border: 1px solid #E5E7EB;
    border-radius: 8px;
    padding: 8px 12px;
    font-size: 13px;
    color: #6B7280;
    cursor: pointer;
    align-self: flex-start;
    transition: all 0.2s ease;

    &:hover {
        border-color: var(--primary-color);
        color: var(--primary-color);
    }
`;

export const ManualHint = styled.p`
    font-size: 12px;
    color: #9CA3AF;
    margin: 0;
    line-height: 1.5;
    font-style: italic;
`;

export const spinningIconStyle = css`
    animation: ${spin} 0.8s linear infinite;
`;

export const LoadingIconWrapper = styled.span`
    display: inline-flex;
    animation: ${spin} 0.8s linear infinite;
`;

export const SuccessIconWrapper = styled.span`
    position: absolute;
    top: 14px;
    right: 14px;
    color: #10B981;
    font-size: 18px;
    line-height: 1;
`;
