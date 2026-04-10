import styled from 'styled-components';

interface CardProps {
    color: string;
}

export const Card = styled.div<CardProps>`
    background: linear-gradient(135deg, ${props => props.color}08 0%, ${props => props.color}58 100%);
    border-radius: 16px;
    padding: 20px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
    border: 1px solid ${props => props.color}30;
    border-left: 4px solid ${props => props.color};
    flex: 1;
    transition: all 0.3s ease;
    position: relative;
    overflow: hidden;
    
    &::before {
        content: '';
        position: absolute;
        top: 0;
        right: 0;
        width: 100px;
        height: 100px;
        background: ${props => props.color}15;
        border-radius: 50%;
        transform: translate(40%, -40%);
        transition: all 0.3s ease;
    }
    
    &:hover {
        transform: translateY(-4px);
        box-shadow: 0 8px 20px ${props => props.color}25;
        border-color: ${props => props.color}60;
        
        &::before {
            transform: translate(30%, -30%);
        }
    }
`

export const CardHeader = styled.div`
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 12px;
    position: relative;
    z-index: 1;
`

export const IconWrapper = styled.div<CardProps>`
    width: 40px;
    height: 40px;
    border-radius: 10px;
    background: ${props => props.color};
    display: flex;
    align-items: center;
    justify-content: center;
    color: #FFFFFF;
    font-size: 18px;
    box-shadow: 0 2px 8px ${props => props.color}40;
`

export const Title = styled.h4`
    margin: 0;
    font-weight: 500;
    font-size: 18px;
    font-weight: 600;
    color: #505C6F;
`

export const Value = styled.p`
    margin: 0;
    font-size: 28px;
    font-weight: bold;
    color: #1e293b;
    margin-left: 52px;
    position: relative;
    z-index: 1;
`