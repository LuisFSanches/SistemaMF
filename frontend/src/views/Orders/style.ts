import styled from 'styled-components'

export const Container = styled.div`
    height: 100vh;
    flex: 5;
    padding: 0.8rem 2rem;
    
    .total-spent{
        color: var(--order-green);
        font-weight: 600;

    }

    .canceled-order {
        background-color: rgba(220, 53, 69, 0.15);
    }

    .canceled-order:hover {
        background-color: rgba(220, 53, 69, 0.25);
    }

    @media (max-width:750px) {
        padding: 0.4rem;
    }
`
