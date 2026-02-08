import styled from "styled-components";

export const Container = styled.div`
    position: relative;
    width: auto;
    min-width: 250px;
`;

export const SelectButton = styled.button`
    width: 100%;
    height: 50px;
    background: #fff;
    border: 2px solid var(--primary-color);
    border-radius: 8px;
    padding: 0 15px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    cursor: pointer;
    transition: all 0.3s ease;

    &:hover {
        background: #f8f9fa;
        border-color: var(--secondary-color);
    }

    div {
        display: flex;
        align-items: center;
        gap: 10px;

        svg {
            color: var(--primary-color);
            font-size: 18px;
        }

        span {
            font-size: 14px;
            font-weight: 600;
            color: #333;
            max-width: 200px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }
    }

    svg.open {
        transform: rotate(180deg);
        transition: transform 0.3s ease;
    }
`;

export const Dropdown = styled.div`
    position: absolute;
    top: 55px;
    left: 0;
    width: 100%;
    min-width: 350px;
    max-height: 400px;
    background: #fff;
    border: 1px solid #ddd;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    z-index: 1000;
    overflow-y: auto;

    &::-webkit-scrollbar {
        width: 8px;
    }

    &::-webkit-scrollbar-track {
        background: #f1f1f1;
        border-radius: 4px;
    }

    &::-webkit-scrollbar-thumb {
        background: var(--primary-color);
        border-radius: 4px;
    }
`;

export const SearchInput = styled.div`
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 12px 15px;
    border-bottom: 1px solid #eee;
    position: sticky;
    top: 0;
    background: #fff;
    z-index: 1;

    svg {
        color: #999;
        font-size: 16px;
    }

    input {
        flex: 1;
        border: none;
        outline: none;
        font-size: 14px;
        padding: 5px;

        &::placeholder {
            color: #999;
        }
    }
`;

export const StoreItem = styled.div`
    padding: 12px 15px;
    cursor: pointer;
    transition: background 0.2s ease;
    border-bottom: 1px solid #f5f5f5;

    &:hover {
        background: #f8f9fa;
    }

    &.active {
        background: #e8f4f8;
        border-left: 3px solid var(--primary-color);
    }

    &:last-child {
        border-bottom: none;
    }

    .store-info {
        display: flex;
        align-items: center;
        gap: 12px;

        img {
            width: 40px;
            height: 40px;
            object-fit: contain;
            border-radius: 4px;
            border: 1px solid #eee;
        }

        div {
            flex: 1;
            display: flex;
            flex-direction: column;
            gap: 4px;

            strong {
                font-size: 14px;
                color: #333;
                font-weight: 600;
            }

            small {
                font-size: 12px;
                color: #666;

                &.count-info {
                    color: #999;
                    font-size: 11px;
                }
            }
        }
    }

    .badge-inactive {
        display: inline-block;
        background: #dc3545;
        color: #fff;
        padding: 2px 8px;
        border-radius: 12px;
        font-size: 11px;
        font-weight: 600;
        margin-left: auto;
    }
`;

export const NoStores = styled.div`
    padding: 20px;
    text-align: center;
    color: #999;
    font-size: 14px;
`;

export const LoadingMessage = styled.div`
    padding: 20px;
    text-align: center;
    color: var(--primary-color);
    font-size: 14px;
    font-weight: 600;
`;
