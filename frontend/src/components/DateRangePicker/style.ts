import styled from "styled-components";

export const Container = styled.div`
    position: relative;
    display: inline-block;
`;

export const DateButton = styled.button`
    padding: 8px 16px;
    border: 1px solid #DBCED0;
    background-color: #F4E5E8;
    color: #000;
    border-radius: 6px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    min-width: 200px;
    text-align: center;
    transition: all 0.2s ease;

    &:hover {
        background-color: #e9d7db;
        border-color: #cbbac0;
    }
`;

export const PickerModal = styled.div`
    position: absolute;
    top: calc(100% + 8px);
    left: 0;
    z-index: 9999;
    background: white;
    border-radius: 12px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
    overflow: hidden;
`;

export const ModalContent = styled.div`
    padding: 16px;
    min-width: 320px;
`;

export const QuickFiltersSection = styled.div`
    display: flex;
    flex-direction: column;
    gap: 8px;
    margin-bottom: 16px;
    padding-bottom: 16px;
    border-bottom: 1px solid #eee;
`;

export const QuickFilterButton = styled.button<{ active: boolean }>`
    padding: 10px 16px;
    border: none;
    background-color: ${props => props.active ? '#EEEEEF' : 'transparent'};
    color: ${props => props.active ? '#EC4899' : '#333'};
    border-radius: 6px;
    font-size: 14px;
    font-weight: ${props => props.active ? '600' : '500'};
    cursor: pointer;
    text-align: left;
    transition: all 0.2s ease;

    &:hover {
        background-color: ${props => props.active ? '#e3f2fd' : '#f5f5f5'};
    }
`;

export const CalendarSection = styled.div`
    margin-bottom: 16px;
`;

export const CalendarHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
`;

export const MonthYearSelector = styled.div`
    font-size: 15px;
    font-weight: 600;
    color: #333;
    text-transform: capitalize;
`;

export const NavButton = styled.button`
    background: none;
    border: none;
    font-size: 24px;
    color: #666;
    cursor: pointer;
    padding: 4px 12px;
    border-radius: 4px;
    transition: all 0.2s ease;

    &:hover {
        background-color: #f5f5f5;
        color: #333;
    }
`;

export const CalendarGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    gap: 4px;
`;

export const DayHeader = styled.div`
    text-align: center;
    font-size: 12px;
    font-weight: 600;
    color: #666;
    padding: 8px 0;
`;

export const DayCell = styled.button<{
    isCurrentMonth: boolean;
    isSelected: boolean;
    isInRange: boolean;
    isToday: boolean;
}>`
    padding: 8px;
    border: none;
    background-color: ${props => {
        if (props.isSelected) return 'var(--primary-color)';
        if (props.isInRange) return '#e3f2fd';
        if (props.isToday) return '#fff3e0';
        return 'transparent';
    }};
    color: ${props => {
        if (props.isSelected) return '#fff';
        if (!props.isCurrentMonth) return '#ccc';
        return '#333';
    }};
    border-radius: 6px;
    font-size: 13px;
    cursor: pointer;
    transition: all 0.2s ease;
    font-weight: ${props => props.isToday ? '600' : '500'};

    &:hover {
        background-color: ${props => props.isSelected ? 'var(--primary-color)' : '#f0f0f0'};
    }

    &:disabled {
        cursor: not-allowed;
        opacity: 0.5;
    }
`;

export const ModalFooter = styled.div`
    display: flex;
    gap: 8px;
    justify-content: flex-end;
    padding-top: 16px;
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
