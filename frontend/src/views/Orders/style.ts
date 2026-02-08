import styled from 'styled-components'

export const Container = styled.div`
    flex: 5;
    padding: 0.8rem 2rem;
    
    .total-spent{
        color: var(--order-green);
        font-weight: 600;
    }

    .view-order {
        background: #66c1df;
        color: #fff;
        padding: 6px;
        border-radius: 5px;
        font-weight: 600;
        text-decoration: none;
        transition: all 0.2s;
        display: inline-block;
        margin-right: 5px;
    }

    .canceled-order {
        background-color: rgba(220, 53, 69, 0.15);
    }

    .canceled-order:hover {
        background-color: rgba(220, 53, 69, 0.25);
    }

    .order-code-link {
        color: #EC4899;
        font-weight: 700;
        text-decoration: none;
        transition: all 0.2s;
        display: inline-block;

        &:hover {
            color: #DB2777;
            transform: translateX(2px);
        }
    }

    @media (max-width:750px) {
        width: 88%;
        padding: 0.4rem;
    }
`
