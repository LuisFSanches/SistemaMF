import styled from 'styled-components'

export const Container = styled.div`
    height: 100vh;
    flex: 5;
    padding: 0.8rem 2rem;
    
    .total-spent{
        color: var(--order-green);
        font-weight: 600;

    }
    @media (max-width:750px) {
        padding: 0.4rem;
    }
`

export const RoleBadge = styled.span<{ role: string }>`
    padding: 0.4rem 0.8rem;
    border-radius: 6px;
    font-size: 0.875rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    
    background-color: ${props => props.role === "SUPER_ADMIN" ? "var(--primary-color)" : "var(--secondary-color)"};
    color: white;
    display: inline-block;
`
