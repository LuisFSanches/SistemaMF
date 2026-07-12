import styled from 'styled-components';

export const ModalContent = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    padding: 2rem 0;

    h2 {
        color: var(--red);
        font-size: 1.8rem;
        margin: 1rem 0;
    }
`;

export const WarningIcon = styled.div`
    font-size: 4rem;
    color: var(--red);
    margin-bottom: 1rem;
    
    svg {
        filter: drop-shadow(0 2px 4px rgba(229, 46, 64, 0.3));
    }
`;

export const Message = styled.div`
    margin: 1.5rem 0;
    
    p {
        font-size: 1.1rem;
        color: var(--text-title);
        line-height: 1.6;
        margin-bottom: 1rem;
        
        &:last-child {
            margin-bottom: 0;
        }
    }
`;

export const ButtonContainer = styled.div`
    width: 100%;
    margin-top: 1rem;

    button {
        width: 100%;
        max-width: 300px;
        height: 3.5rem;
        font-size: 1.1rem;
    }
`;
