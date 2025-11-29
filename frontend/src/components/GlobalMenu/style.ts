import styled from "styled-components";

interface MenuButtonProps {
    isActive: boolean
}

export const MenuList = styled.div`
    display: flex;
    flex-direction: column;
`;

export const NavButton = styled.button<MenuButtonProps>`
    display: flex;
    align-items: center;
    background: ${({ isActive }) => isActive ? '#EC4899' : 'none'};
    border: none;
    cursor: pointer;
    padding: 8px 16px;
    border-radius: 8px;
    color: ${({ isActive }) => isActive ? '#fff' : '#333'};
    font-weight: bold;

    span {
        font-size: 16px;
    }

    svg {
        margin-right: 8px;
        font-size: 18px;
    }
`;