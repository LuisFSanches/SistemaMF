import styled from "styled-components";

export const Container = styled.div`
    display: flex;
    flex-direction: column;
    flex: 5;
    padding: 0.8rem 2rem;
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

export const ProductsContainer = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(239px, 1fr));
    gap: 20px;
    padding: 0;

    @media (max-width: 768px) {
        grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
        gap: 16px;
    }

    @media (max-width: 480px) {
        grid-template-columns: 1fr;
    }
`

export const SearchContainer = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 1rem;
    margin: 0 0 1.5rem 0;
    flex-wrap: wrap;

    .search-box {
        flex: 1;
        min-width: 300px;
        display: flex;
        align-items: center;
        gap: 0.8rem;
        background: var(--white-background);
        padding: 7px 10px;
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
    color: #323332;
    border: 1px solid #B5B5B5;

    &.download {
        &:hover:not(:disabled) {
            opacity: 0.9;
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(0, 123, 255, 0.3);
            background: var(--primary-color);
            color: white;
        }
    }

    &.upload {
        &:hover:not(:disabled) {
            opacity: 0.9;
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
            background: #10b981;
            color: white;
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
