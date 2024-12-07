import styled from "styled-components";

export const Container = styled.div<{ show: boolean }>`
    display: ${({ show }) => show ? 'flex' : 'none'};
    bottom: 0;
    left: 0;
    margin: auto;
    position: fixed;
    right: 0;
    top: 0;
    z-index: 9999;
    background: rgba(255, 255, 255, .5);

    img {
        max-width: 100%;
        height: auto;
        border: 0;
        bottom: 0;
        left: 0;
        margin: auto;
        position: fixed;
        right: 0;
        top: 0;
        z-index: 100;
    }
`;