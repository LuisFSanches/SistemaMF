import styled from 'styled-components'

export const TableContainer = styled.div`
    a {
        text-decoration: none;
        margin-top: 16px;
        color: #e7b7c2;
        font-weight: bold;
        margin-left: 16px;

        &:hover {
            text-decoration: underline;
        }
    }
`;

export const Table = styled.table`
    width: 100%;
    border-collapse: collapse;
    margin-top: 16px;
    border: none;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);

    tbody {
        ::-webkit-scrollbar {
            width: 8px;
        }
    }
`

export const Th = styled.th`
    text-align: center;
    padding: 12px;
    border-bottom: 1px solid #ccc;
    background: white;
    font-size: 16px;
    color: #909090;
`

export const Td = styled.td`
    padding: 12px;
    border-bottom: 1px solid #eee;
    font-size: 16px;

    span {
        padding: 7px;
        border-radius: 8px;

        &.WAITING_FOR_CLIENT {
            background: #f4f4f4;
        }

        &.OPENED {
            background: #f8f4de;
        }

        &.IN_PROGRESS {
            background: #c3d7f1;
        }

        &.IN_DELIVERY {
            background: #d2e4ca;
        }

        &.DONE {
            background: #e7b7c2;
        }
    }
`
