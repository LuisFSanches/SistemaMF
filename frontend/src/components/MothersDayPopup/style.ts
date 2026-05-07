import styled from "styled-components";
import mothersDayBackground from "../../assets/images/mothers_day_popup.png";

export const ModalContent = styled.div`
    position: relative;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    border-radius: 0.25rem;
    overflow: hidden;
    min-height: 550px;

    @media (max-width: 768px) {
        flex-direction: column;
        min-height: 500px;
        justify-content: flex-start;
    }
`;

export const BackgroundImage = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-image: url(${mothersDayBackground});
    background-size: 100% 100%;
    background-position: center;
    background-repeat: no-repeat;
    z-index: 0;

    @media (max-width: 768px) {
        background-position: center top;
        background-size: cover;
    }
`;
