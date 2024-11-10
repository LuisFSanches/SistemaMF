import styled from 'styled-components'

export const Container = styled.div`
    flex: 5;
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    padding: 1rem;
    grid-gap: 1.5rem;

    .order-container{
        display: flex;
        flex-direction: column;
        height: 95vh;
        border: 1px solid var(--shadow-color);
        border-radius: 0.5rem;
        background-color: #fff;
        box-shadow: 0.3rem 0.3rem 0.2rem var(--shadow-color);
        overflow-y: auto;
    }

    header{
        display: flex;
        justify-content: center;
        width: 100%;
        padding: 1rem;
        font-size: 1.3rem;
        font-weight: 600;
    }

    .opened-order{
        background: var(--order-yellow);
    }
    .in-progress-order{
        background: var(--order-blue);
    }
    .finished-order{
        background: var(--order-green);
    }

    .opened{
        background: #f8f4de;
        box-shadow:0.1rem 0.2rem var(--shadow-color)
    }
    .in_progress{
        background:#c3d7f1;
        box-shadow: 0.1rem 0.2rem var(--shadow-color);
    }
    .done {
        background:#d2e4ca;
        box-shadow: 0.1rem 0.2rem var(--shadow-color);
    }

    @media (max-width: 1200px){
        grid-template-columns:1fr;
        grid-gap: 0.8rem;
        padding: 0.5rem;
        .order-container{
            height: 31.5vh;
        }
        header{
            padding: 0.4rem;
        }
    }
`

export const OrderCard= styled.div`
    margin: 0.6rem;
    padding: 0.5rem 0.7rem;
    border-radius: 0.3rem;
    color: var(--text-body);

    .order-number{
        width: 100%;
        text-align: center;
        margin-bottom: 0.5rem;
    }

    .inline-container {
        width: 100%;
        display: flex;
        justify-content: space-between;
    }

    .order-info{
        display: flex;
        justify-content: space-between;
        margin-bottom: 0.2rem;

        h2{
            font-size: 1.65rem;
        }
    }
    .client-info{
        display: flex;
        justify-content: space-between;
        margin-bottom: 0.6rem;
    }
    .order-content{
        width: 100%;
        display: flex;
        justify-content: space-between;
    }
    .order-actions{
        width: 100%;
        display: flex;
        justify-content: space-around;
        padding: 0.5rem;
    }

    .address-container, .value-container {
        margin: 10px 0;

        p {
            margin: 5px 0;
        }
    }

    .value-container {
        display: flex;
        align-items: center;
        justify-content: end;
        font-size: 1.1rem;
    }

    button{
        display: flex;
        font-size: 1.1rem;
        padding: 0.6rem;
        border-radius: 0.3rem;

        p{
            margin-left: 0.3rem;
        }
    }

    .print{
        color: var(--text-title);
        background: #fff;
    }
    .to-production{
        color: #fff;
        background: var(--order-blue);
    }
    .to-finished{
        color: #fff;
        background: var(--order-green);
    }
    .delivered{
        background: var(--orange);
        color: #fff;
    }

`