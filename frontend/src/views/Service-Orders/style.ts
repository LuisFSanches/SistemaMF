import styled from 'styled-components'

export const Container = styled.div`
    display: flex;
    flex-direction: column;
    flex: 1;
    overflow: visible;

    .order-container.opened::-webkit-scrollbar-thumb {
        background: #FFD700;
    }

    .order-container.in_progress::-webkit-scrollbar-thumb {
        background: #1E90FF;
    }

    .order-container.in_delivery::-webkit-scrollbar-thumb {
        background: #32CD32;
    }

    header {
        display: flex;
        justify-content: center;
        width: 100%;
        padding: 0.6rem;
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

    @media (max-width: 1250px){
        grid-template-columns: 1fr 1fr;
    }

    @media (max-width: 1024px){
        grid-template-columns: 1fr;
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

export const OrderContainer = styled.div`
    display: flex;
    flex-direction: column;
    height: 95vh;
    border: 1px solid var(--shadow-color);
    border-radius: 0.5rem;
    background-color: #fff !important;
    box-shadow: 0.3rem 0.3rem 0.2rem var(--shadow-color);
    overflow-y: auto;

    ::-webkit-scrollbar {
        width: 5px;
    }

    ::-webkit-scrollbar-track {
        background: #f1f1f1;
        border-radius: 8px;
    }

    ::-webkit-scrollbar-thumb {
        border-radius: 8px;
    }

    ::-webkit-scrollbar-thumb:hover {
        background: #a1a1a1;
    }

    .opened {
        border-left: 8px solid var(--order-yellow);
    }
    .in_progress{
        border-left: 8px solid var(--order-blue);
    }
    .in_delivery {
        border-left: 8px solid var(--order-green);
    }
`

export const Orders = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    padding: 1rem;
    grid-gap: 2.1rem;
`
export const Header = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-left: 15px;
    margin-top: 10px;
    margin-bottom: 20px;
    gap: 15px;
    position: relative;
    z-index: 10;


    .type-filters {
        display: flex;
        flex: 1;
        flex-wrap: wrap;
        align-items: center;
    }

    .type-filters button {
        padding: 10px;
        margin-right: 10px;
        border-radius: 5px;
        color: white;
        font-weight: 600;
        border: none;

        &.active {
            border: 3px solid pink;
        }

        &.active-date {
            border: 1px solid white;
            background-color: #e7b7c2;
            color: white;
        }
    }

    .type-filters .all-orders {
        background-color: #979795;
    }

    .type-filters .counter-orders {
        background-color: #71265D;
    }

    .type-filters .store-front-orders {
        background-color: #4A90E2;
    }

    .type-filters .online-orders {
        background-color: #246D90;
    }

    .type-filters .store-orders {
        background-color: #EC4899;
    }

    .type-filters input {
        max-width: 310px;
        margin-left: 15px;
        padding: 10px;
        border-radius: 5px;
        border: 1px solid #ddd;
    }

    .date-filters {
        display: flex;
        align-items: center;

        input {
            width: 300px;
            margin-left: 15px;
        }
    }

    @media (max-width: 1024px) {
        flex-direction: column;
        gap: 10px;

        .type-filters {
            flex-direction: column;
            width: 100%;
        }

        .date-filters {
            display: flex;
        }

        input {
            margin-left: 0;
            margin-top: 10px;
            width: 100%;
            max-width: 100%;
        }
    }
`