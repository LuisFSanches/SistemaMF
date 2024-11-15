import styled from 'styled-components'

export const OrderCardContainer= styled.div`
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
        background: var(--sideBarBackground);
        color: #fff;
    }
`
