import styled from 'styled-components'

export const OrderItem = styled.div`
    background-color: white;
    border-radius: 8px;
    margin-bottom: 15px;
    padding: 15px 20px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    border: 2px solid #eaeaea;

    .address-container {
        margin: 5px 0;
    }
`;

export const OrderHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;

    .order-info {
        min-width: 235px;
        max-width: 235px;

        p {
            strong {
                margin-left: 5px;
            }
        }
    }
`;

export const OrderInfo = styled.h3`
    margin: 0;
    font-size: 16px;
    font-weight: 500;
    margin-bottom: 5px;

    strong {
        margin-left: 0px;
    }
`;

export const ActionsContainer = styled.div`
    display: flex;
    justify-content: space-between;
    gap: 10px;
    margin-top: 10px;

    div {
        display: flex;
    }
`;

export const MoveButton = styled.button`
    display: flex;
    align-items: center;
    margin-right: 25px;
    background-color: #4caf50;
    color: white;
    border: none;
    border-radius: 4px;
    padding: 8px 16px;
    cursor: pointer;
    font-weight: 600;

    &:hover {
        background-color: #45a049;
    }

    span {
        margin: 0 5px;
    }

    &.status-button {
        background-color: #EC754A;
    }
`;

export const ActionButton = styled.button`
    background-color: #2196f3;
    color: white;
    border: none;
    border-radius: 4px;
    padding: 8px 10px;
    cursor: pointer;
    font-weight: 600;

    &:not(:last-child) {
        margin-right: 20px;
    }

    &:hover {
        background-color: #0b7dda;
    }

    span {
        margin-left: 5px;
    }
`;

export const PrintButton = styled.button`
    background-color: #2196f3;
    color: white;
    border: none;
    border-radius: 4px;
    padding: 8px 16px;
    cursor: pointer;
    font-weight: 600;

    &:hover {
        background-color: #0b7dda;
    }

    span {
        margin-left: 5px;
    }
`;
export const OrderClient = styled.div`
    margin-bottom: 5px;
    font-size: 16px;
`;

export const OrderStatus = styled.div<{ status: string }>`
    font-weight: 700;
    color: ${props => {
    switch (props.status) {
        case 'OPENED':
        return '#ff9800';
        case 'IN_PROGRESS':
        return '#2196f3';
        case 'IN_DELIVERY':
        return '#4caf50';
        default:
        return '#757575';
    }
    }};
`;

export const ExpandedContent = styled.div`
    display: flex;
    justify-content: flex-start;
    margin-top: 10px;
    border-top: 1px solid #e5e5e5;
    padding-top: 10px;

    .expanded-container:first-child {
        margin-right: 100px;
    }
`;

export const OrderType = styled.div<{ isOnlineOrder: boolean }>`
    width: 80px;
    position: relative;

    span {
        width: 80px;
        background-color: ${props => (props.isOnlineOrder ? '#246D90' : '#71265D')};
        color: white;
        text-align: center;
        padding: 5px 0;
        border-radius: 4px;
        font-weight: 600;
        font-size: 14px;
        position: absolute;
        top: -50px;
        left: 10px;
    }
`;