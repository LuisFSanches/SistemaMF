import styled from 'styled-components'

export const OrderCardContainer= styled.div`
    margin-bottom: 20px;
    padding: 0.5rem 0.7rem;
    border-radius: 0.3rem;
    color: var(--text-body);
    position: relative;

    h3 {
        font-size: 17px;
    }

    .order-number {
        width: 100%;
        display: flex;
        justify-content: space-between;
        text-align: center;
        margin-bottom: 0.5rem;

        svg {
            cursor: pointer;
        }

        .order-type {
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 5px 10px;
            border-radius: 15px;
            color: white;
            font-weight: 700;

            &.online {
                background: #548E8E;
            }

            &.on_store {
                background: #DA1421;
            }
        }
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

    .delivery-date {
        text-align: end;
    }

    .card-container {
        margin-top: 10px;
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

    .view-button {
        svg {
            margin-left: 5px;
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
