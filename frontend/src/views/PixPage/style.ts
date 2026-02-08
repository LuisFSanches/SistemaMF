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

export const DateContainer = styled.div`
    display: flex;

    div {
        margin-right: 5px;
    }
`

export const ConfigErrorContainer = styled.div`
    padding: 20px;
    background-color: #fff3cd;
    border: 1px solid #ffc107;
    border-radius: 8px;
    margin-top: 20px;
    text-align: center;

    h3 {
        color: #856404;
        margin-bottom: 10px;
    }

    p {
        color: #856404;
        margin-bottom: 15px;
    }

    a {
        padding: 10px 20px;
        background-color: var(--primary-color);
        color: #fff;
        text-decoration: none;
        border-radius: 4px;
        display: inline-block;
        transition: opacity 0.2s;

        &:hover {
            opacity: 0.9;
        }
    }
`