import styled from 'styled-components'

export const Container = styled.div`
    background: white;
    border-radius: 12px;
    padding: 20px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.05);
    min-width: 280px;
    margin-left: 24px;
`

export const AdminItem = styled.div`
    padding: 12px 0;
    border-bottom: 1px solid #eee;

    &:last-child {
        border-bottom: none;
    }
`
