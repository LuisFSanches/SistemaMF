import styled from 'styled-components'

export const OrderCardContainer= styled.div`
    padding: 0.5rem 0.7rem;
    border-radius: 0.3rem;
    color: var(--text-body);
    position: relative;
    border: 2px solid #DFE0E1;
    box-shadow: 4px 2px 8px var(--shadow-color);
    margin-bottom: 25px;

    .order-header {
        display: none;
    }

    h3 {
        font-size: 16px;
    }

    p, span, strong {
        font-size: 16px;
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

            svg {
                margin-right: 5px;
            }

            &.whatsapp {
                background: #548E8E;
            }

            &.on_store {
                background: #71265D;
            }

            &.on_site {
                background: #4A90E2;
            }

            &.pdv {
                background: #EC4899;
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
        flex-direction: column;
        align-items: flex-start;
        justify-content: space-between;
        margin-bottom: 0.6rem;

        .delivery-date {
            margin-top:10px;
        }
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
        background: #f8f8f8;
        padding: 8px;
        border-radius: 10px;

        .order-items {
            p {
                margin-bottom: 4px;
            }
        }
    }
    .move-order {
        width: 100%;
        display: flex;
        justify-content: space-around;
        padding: 0.5rem;

        button {
            width: 48%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: 700;
        }
    }

    .order-actions {
        width: 100%;
        display: flex;
        justify-content: space-around;
        padding: 0.5rem;

        button {
            width: inherit;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-right: 5px;
            font-weight: 700;

            svg {
                margin-right: 5px;
            }
        }

        .whatsapp-button {
            display: flex;
            align-items: center;
            justify-content: center;
            background: #198754;
            color: white;
            font-weight: 700;
        }
    }

    .order-card-container, .value-container {
        margin: 8px 0;

        p {
            margin: 5px 0;
        }
    }

    .order-card-container {
        &.address {
            padding: 8px;
            background: #f8f8f8;
            border-radius: 10px;
        }

        &.order-values {
            padding: 8px;
            background: #DFE0E1;
            border-radius: 10px;

            .total-value {
                color: green;
                font-weight: 700;
            }
        }

        &.observation {
            background: #fff3cd;
            border-left: 4px solid #ffc107;
            padding: 8px;
            border-radius: 8px;
        }
    }

    .value-container {
        display: flex;
        align-items: center;
        justify-content: end;
        font-size: 1.1rem;
    }

    button {
        display: flex;
        font-size: 15px;
        padding: 0.6rem;
        border-radius: 0.3rem;

        p {
            margin-left: 0.3rem;
            font-size: 15px;
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
    .to-open {
        background: var(--order-yellow);
        color: #000;
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
