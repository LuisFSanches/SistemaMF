import styled from 'styled-components';

export const ModalContent = styled.div`
    background: white;
    border-radius: 0.75rem;
    max-width: 500px;
    width: 100%;
    margin: 0 auto;

    @media (max-width: 600px) {
        max-width: 100%;
    }
`;

export const ModalHeader = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1.5rem;
    padding-bottom: 1rem;
    border-bottom: 1px solid #E5E7EB;
`;

export const ModalTitle = styled.h2`
    font-size: 1.5rem;
    font-weight: 600;
    color: #333;
    margin: 0;

    @media (max-width: 600px) {
        font-size: 1.25rem;
    }
`;

export const ModalBody = styled.div`
    padding: 1.5rem;
`;

export const InputSection = styled.div`
    margin-bottom: 1.5rem;
`;

export const InputLabel = styled.label`
    display: block;
    font-size: 1rem;
    font-weight: 600;
    color: #555;
    margin-bottom: 0.5rem;
`;

export const CouponCodeInput = styled.input`
    width: 100%;
    padding: 0.875rem 1rem;
    font-size: 1rem;
    border: 2px solid #E5E7EB;
    border-radius: 0.5rem;
    transition: all 0.2s ease;
    text-transform: uppercase;
    font-weight: 600;
    letter-spacing: 0.05em;

    &:focus {
        outline: none;
        border-color: #EC4899;
        box-shadow: 0 0 0 3px rgba(236, 72, 153, 0.1);
    }

    &:disabled {
        background: #f3f4f6;
        cursor: not-allowed;
    }

    &::placeholder {
        text-transform: none;
        font-weight: normal;
        letter-spacing: normal;
    }
`;

export const ApplyCouponButton = styled.button`
    width: 100%;
    padding: 0.875rem 1.5rem;
    margin-top: 1rem;
    background: ${props => props.disabled ? '#f3f4f6' : '#EC4899'};
    color: ${props => props.disabled ? '#9CA3AF' : 'white'};
    border: none;
    border-radius: 0.5rem;
    font-size: 1rem;
    font-weight: 600;
    cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
    transition: all 0.2s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;

    &:hover:not(:disabled) {
        background: #DB2777;
        transform: translateY(-1px);
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }

    &:active:not(:disabled) {
        transform: translateY(0);
    }
`;

export const ErrorMessage = styled.p`
    margin-top: 0.75rem;
    font-size: 0.875rem;
    color: #f44336;
    display: flex;
    align-items: center;
    gap: 0.5rem;
`;

export const SuccessMessage = styled.p`
    margin-top: 0.75rem;
    font-size: 0.875rem;
    color: #4caf50;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-weight: 600;
`;

export const Divider = styled.div`
    text-align: center;
    margin: 1.5rem 0;
    position: relative;

    &::before,
    &::after {
        content: '';
        position: absolute;
        top: 50%;
        width: 40%;
        height: 1px;
        background: #E5E7EB;
    }

    &::before {
        left: 0;
    }

    &::after {
        right: 0;
    }

    span {
        background: white;
        padding: 0 1rem;
        color: #9CA3AF;
        font-size: 0.875rem;
        font-weight: 500;
        text-transform: lowercase;
    }
`;

export const CancelButton = styled.button`
    width: 100%;
    padding: 0.875rem 1.5rem;
    background: white;
    color: #6B7280;
    border: 1px solid #E5E7EB;
    border-radius: 0.5rem;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;

    &:hover {
        background: #F9FAFB;
        border-color: #9CA3AF;
    }
`;

export const LoadingContainer = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.75rem;
`;
