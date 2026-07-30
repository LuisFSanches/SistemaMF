import styled from "styled-components";

export const Container = styled.div`
    position: relative;
    display: inline-block;
`;

export const FilterButton = styled.button<{ active: boolean }>`
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px 16px;
    border: 1px solid ${props => props.active ? 'var(--primary-color)' : '#DBCED0'};
    background-color: ${props => props.active ? '#FCE7EE' : '#F4E5E8'};
    color: #000;
    border-radius: 6px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    min-width: 140px;
    justify-content: center;
    transition: all 0.2s ease;

    &:hover {
        background-color: #e9d7db;
        border-color: #cbbac0;
    }
`;

export const FilterCount = styled.span`
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 18px;
    height: 18px;
    padding: 0 5px;
    border-radius: 999px;
    background-color: var(--primary-color);
    color: #fff;
    font-size: 11px;
    font-weight: 700;
`;

export const PopoverPanel = styled.div`
    position: absolute;
    top: calc(100% + 8px);
    z-index: 9999;
    background: white;
    border-radius: 12px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
    overflow: hidden;
`;

export const PanelContent = styled.div`
    padding: 16px;
    min-width: 280px;
    display: flex;
    flex-direction: column;
    gap: 12px;
`;

export const FieldGroup = styled.label`
    display: flex;
    flex-direction: column;
    gap: 6px;
    font-size: 12px;
    font-weight: 600;
    color: #666;

    input {
        font: inherit;
        font-weight: 400;
        font-size: 14px;
        color: #333;
        padding: 8px 10px;
        border: 1px solid #ddd;
        border-radius: 6px;
        outline: none;

        &:focus {
            border-color: var(--primary-color);
        }
    }
`;

export const PanelFooter = styled.div`
    display: flex;
    gap: 8px;
    justify-content: flex-end;
    padding-top: 8px;
    border-top: 1px solid #eee;
`;

export const ClearButton = styled.button`
    padding: 8px 16px;
    background-color: transparent;
    color: #666;
    border: 1px solid #ddd;
    border-radius: 6px;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;

    &:hover {
        background-color: #f5f5f5;
        border-color: #999;
    }
`;

export const ApplyButton = styled.button`
    padding: 8px 16px;
    background-color: #EC4899;
    color: white;
    border: none;
    border-radius: 6px;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: background-color 0.2s ease;

    &:hover {
        opacity: 0.9;
    }
`;
