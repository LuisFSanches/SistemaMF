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
