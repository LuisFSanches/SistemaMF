import styled from 'styled-components'

export const Container = styled.div`
    flex: 5;
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    padding: 1rem;
    grid-gap: 1.5rem;

    .order-container {
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
    }

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

    .opened {
        background: #f8f4de;
        box-shadow:0.1rem 0.2rem var(--shadow-color)
    }
    .in_progress{
        background:#c3d7f1;
        box-shadow: 0.1rem 0.2rem var(--shadow-color);
    }
    .in_delivery {
        background:#d2e4ca;
        box-shadow: 0.1rem 0.2rem var(--shadow-color);
    }

    @media (max-width: 1250px){
        grid-template-columns: 1fr 1fr;

        .order-container {
            height: 47vh;
        }
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
