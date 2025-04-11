import styled from 'styled-components'

export const Container = styled.div`
    width: 100%;
    padding: 32px;
`

export const Header = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 32px;
`

export const Grid = styled.div`
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 16px;
    margin-bottom: 24px;
`
export const Row = styled.div`
    display: flex;
    marginTop: 32px;
    alignItems: flex-start;

    h2 {
        margin-left: 20px;
    }
`;

export const RecentOrders = styled.div`
    flex: 1;
    background: white;
    padding: 10px;
    border-radius: 12px;
`;