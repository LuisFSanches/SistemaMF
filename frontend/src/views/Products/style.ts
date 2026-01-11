import styled from "styled-components";

export const Container = styled.div`
    display: flex;
    flex-direction: column;
    height: 100vh;
    flex: 5;
    padding: 0.8rem 2rem;
    overflow-x: hidden;
    margin-top: 0.5rem;
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

export const SearchContainer = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 1rem;
    margin: 1.5rem 0;
    flex-wrap: wrap;

    .search-box {
        flex: 1;
        min-width: 300px;
        display: flex;
        align-items: center;
        gap: 0.8rem;
        background: var(--white-background);
        padding: 3px 10px;
        border-radius: 0.5rem;
        border: 1px solid #e5e7eb;

        svg {
            color: var(--text-body);
            font-size: 1rem;
        }

        input {
            flex: 1;
            border: none;
            background: transparent;
            font-size: 0.95rem;
            padding: 0.5rem 0;
            
            &:focus {
                outline: none;
            }
        }

        .search-btn {
            padding: 0.5rem 1rem;
            background: var(--primary-color);
            color: white;
            border: none;
            border-radius: 0.4rem;
            font-size: 0.9rem;
            font-weight: 500;
            cursor: pointer;
            transition: opacity 0.3s;

            &:hover {
                opacity: 0.9;
            }
        }
    }

    .action-buttons {
        display: flex;
        gap: 0.75rem;
        
        button {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            padding: 0.65rem 1.2rem;
            border: none;
            border-radius: 0.5rem;
            font-size: 0.9rem;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.3s ease;
            white-space: nowrap;

            svg {
                font-size: 1rem;
            }

            p {
                margin: 0;
            }

            &.qr-button {
                background: #10b981;
                color: white;

                &:hover {
                    opacity: 0.9;
                    transform: translateY(-2px);
                    box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
                }
            }

            &.add-button {
                background: var(--primary-color);
                color: white;

                &:hover {
                    opacity: 0.9;
                    transform: translateY(-2px);
                    box-shadow: 0 4px 12px rgba(0, 123, 255, 0.3);
                }
            }
        }
    }

    @media (max-width: 768px) {
        flex-direction: column;
        align-items: stretch;

        .search-box {
            min-width: 100%;
        }

        .action-buttons {
            width: 100%;
            justify-content: flex-end;

            button {
                flex: 1;
            }
        }
    }
`

export const ActionButtons = styled.div`
    display: flex;
    gap: 0.75rem;
    align-items: center;

    @media (max-width: 768px) {
        width: 100%;
        justify-content: flex-end;
    }
`

export const ExcelButton = styled.button`
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.65rem 1.2rem;
    border: none;
    border-radius: 0.5rem;
    font-size: 0.9rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.3s ease;
    white-space: nowrap;

    &.download {
        background: var(--primary-color);
        color: white;

        &:hover:not(:disabled) {
            opacity: 0.9;
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(0, 123, 255, 0.3);
        }
    }

    &.upload {
        background: #10b981;
        color: white;

        &:hover:not(:disabled) {
            opacity: 0.9;
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
        }
    }

    &:disabled {
        opacity: 0.6;
        cursor: not-allowed;
    }

    svg {
        font-size: 1rem;
    }

    @media (max-width: 768px) {
        padding: 0.6rem 1rem;
        font-size: 0.85rem;
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
    grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
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

    background: white;
    box-shadow: 0.3rem 0.1rem 0.1rem 0.1rem var(--shadow-color);

    &.disabled {
        background-color: #D0D0D0;
    }

    .product-title {
        width: 100%;
        min-height: 3rem;
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 0.2rem 0;
        text-align: center;
        background: var(--sideBarBackground);
        color: white;
    }

    .product-info {
        width: 100%;
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

        .product-status {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin: 0.3rem 0;
            margin-bottom: 0.5rem;
        }
    }

    .product-actions {
        width: 100%;
        display: flex;
        align-items: center;
        margin-top: 0.5rem;
        margin-bottom: 0.4rem;
        padding: 0 1rem;

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
`

export const ProductImage = styled.img`
    width: 100%;
    height: 100px;
    object-fit: contain;
    margin-top: 12px;
`