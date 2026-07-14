import styled from 'styled-components';

export const FormRow = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
    margin-bottom: 0rem;

    @media (max-width: 768px) {
        grid-template-columns: 1fr;
    }
`;

export const HelpText = styled.small`
    display: block;
    margin-top: 0.25rem;
    margin-bottom: 0.75rem;
    color: #777;
    font-size: 0.85rem;
`;

export const SectionTitle = styled.h3`
    font-size: 1.1rem;
    font-weight: 600;
    color: #555;
    margin-top: 0;
    margin-bottom: 0.5rem;
    padding-bottom: 0.5rem;
    border-bottom: 2px solid #f3f4f6;
    
    &:first-of-type {
        margin-top: 0;
    }
`;
