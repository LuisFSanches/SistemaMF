import styled from "styled-components";

export const Container = styled.div`
    display: flex;
    flex-direction: column;
    height: 100vh;
    flex: 5;
    padding: 0.8rem 2rem;
    overflow-x: hidden;
    margin-top: 1rem;
    margin-right: 1rem;

    header{
        width: 100%;
        justify-content: space-between;
        display: fixed;
        overflow-y: hidden;
        overflow-x: auto;
    }

    @media (max-width: 750px){
        header{
            height: 11rem;
        }
    }
    
`
export const ContainerTitle = styled.div`
    display: flex;
    align-items: center;
    margin-left: 1rem;
    margin-bottom: 1rem;

    div{
        display: flex;
        align-items: center;

        h2{
            margin-left: 0.5rem;
        }
    }

    button{
        display: flex;
        border:none;
        border-radius: 0.5rem;
        padding: 0.4rem 0.5rem ;
        color: var(--text-white);
        font-weight: 500;
        font-size: 1.1rem;
        margin-left: 2rem;

        p{
            margin-left: 0.5rem;
        }
    }
`

export const ProductsContainer = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr;
    grid-gap: 1.5rem;
    max-height: 80%;
    overflow-y: auto;
    overflow-x: hidden;

    @media (max-width:1200){
        grid-template-columns: 1fr 1fr 1fr;
    }

    @media (max-width:900px){
        grid-template-columns: 1fr 1fr;
    }
    @media (max-width:600px){
        grid-template-columns: 1fr;
    }
`

export const ProductItem = styled.div`
    display: flex;
    flex-direction:column;
    align-items: center;
    border: 1px solid pink;
    border-radius: 0.4rem;

    background: var(--white-background);
    box-shadow: 0.3rem 0.1rem 0.1rem 0.1rem var(--shadow-color);

    &.disabled {
        background-color: #D0D0D0;
    }

    .product-title{
        width: 100%;
        padding: 0.2rem 0;
        text-align: center;
        background: var(--sideBarBackground);
        color: white;
    }

    .product-info {
        display: flex;
        flex-direction: column;

        strong {
            margin-left: 5px;
        }

        .enabled {
            color: green;
        }

        .disabled {
            color: red;
        }
    }

    .product-actions {
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: space-around;
        margin-top: 0.5rem;
        margin-bottom: 0.4rem;

        span {
            font-size: 1.1rem;
            font-weight: 500;
            color: var(--text-body);
        }
        button{
            background: #fff;
            padding: 0.5rem;
            outline: none;
            border: none;
            border-radius: 1rem;
        }
        .product-action-icon{
            font-size: 1.2rem;
        }
        .edit{
            color: var(--blue);
        }
        .delete{
            color: var(--red)
        }
    }

    img{
        width: 7rem;
        height: 7rem;
        margin-right: 0.2rem;
    }

`