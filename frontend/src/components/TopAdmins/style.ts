import styled from 'styled-components'

export const Container = styled.div`
    background: linear-gradient(135deg,#F5A3CC08 0%,#F5A3CC58 100%);
    border-radius: 16px;
    padding: 24px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    min-width: 320px;
    
    h3 {
        margin: 0 0 20px 0;
        font-size: 18px;
        font-weight: 600;
        color: #38404D;
        display: flex;
        align-items: center;
        gap: 10px;

        svg {
            margin-right: 5px;
        }
    }
    
    @media (max-width: 1024px) {
        margin-left: 0;
        margin-top: 24px;
        min-width: auto;
    }
`

export const AdminItem = styled.div<{ position: number }>`
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 16px;
    border-radius: 12px;
    margin-bottom: 12px;
    transition: all 0.3s ease;
    position: relative;
    overflow: hidden;
    
    ${props => {
        if (props.position === 0) {
            return `
                background: linear-gradient(135deg, rgba(245, 203, 46, 0.1) 0%, rgba(245, 203, 46, 0.05) 100%);
                border: 1px solid rgba(245, 203, 46, 0.2);
            `;
        } else if (props.position === 1) {
            return `
                background: linear-gradient(135deg, rgba(156, 163, 175, 0.1) 0%, rgba(156, 163, 175, 0.05) 100%);
                border: 1px solid rgba(156, 163, 175, 0.2);
            `;
        } else if (props.position === 2) {
            return `
                background: linear-gradient(135deg, rgba(234, 88, 12, 0.1) 0%, rgba(234, 88, 12, 0.05) 100%);
                border: 1px solid rgba(234, 88, 12, 0.2);
            `;
        }
        return `
            background: linear-gradient(135deg, rgba(238, 200, 238, 0.3) 0%, rgba(238, 200, 238, 0.2) 100%);
        `;
    }}
    
    &:last-child {
        margin-bottom: 0;
    }
    
    &:hover {
        transform: translateY(-2px);
        ${props => {
            if (props.position === 0) {
                return 'box-shadow: 0 4px 12px rgba(245, 203, 46, 0.2);';
            } else if (props.position === 1) {
                return 'box-shadow: 0 4px 12px rgba(156, 163, 175, 0.2);';
            } else if (props.position === 2) {
                return 'box-shadow: 0 4px 12px rgba(234, 88, 12, 0.2);';
            }
            return 'box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);';
        }}
    }
`

export const AdminsContainer = styled.div``;

export const AdminInfo = styled.div`
    display: flex;
    align-items: center;
    gap: 12px;
    flex: 1;
`

export const MedalIcon = styled.span`
    font-size: 36px;
    min-width: 32px;
    text-align: center;
`

export const AdminDetails = styled.div`
    display: flex;
    flex-direction: column;
    gap: 4px;
`

export const AdminName = styled.strong`
    color: #38404D;
    font-size: 18px;
    font-weight: 600;
`

export const AdminOrders = styled.span`
    color: #505C6F;
    font-size: 16px;
    font-weight: 400;
`
