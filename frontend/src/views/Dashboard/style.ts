import styled from 'styled-components'

export const Container = styled.div`
    width: 100%;
    padding: 32px;
    
    @media (max-width: 768px) {
        padding: 16px;
    }
`

export const Header = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 32px;
    
    @media (max-width: 768px) {
        flex-direction: column;
        gap: 16px;
        align-items: flex-start;
    }
`

export const Grid = styled.div`
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 20px;
    margin-bottom: 32px;
    
    @media (max-width: 1200px) {
        grid-template-columns: repeat(2, 1fr);
    }
    
    @media (max-width: 768px) {
        grid-template-columns: 1fr;
    }
`

export const SectionTitle = styled.h3`
    font-size: 18px;
    font-weight: 600;
    margin: 32px 0 16px 0;
    padding-left: 4px;
`

export const RecentOrders = styled.div`
    flex: 1;
    background: white;
    padding: 10px;
    border-radius: 12px;
`;