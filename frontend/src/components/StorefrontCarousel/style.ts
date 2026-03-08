import styled from "styled-components";

export const CarouselSection = styled.section`
    width: 100%;
    max-width: 1440px;
    margin: 25px auto;

    @media (max-width: 768px) {
        padding: 0 0.5rem;
        margin-bottom: 1.5rem;
        overflow: hidden;
    }
`;

export const CarouselHeader = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 1rem;
    padding: 0 0.25rem;
`;

export const CarouselTitle = styled.h2`
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto;
    font-size: 40px;
    font-weight: 700;
    position: relative;

    span, strong {
        margin-right: 6px;
    }

    strong {
        color: #e95578;
    }

    @media (max-width: 768px) {
        font-size: 20px;
    }
`;

export const CarouselTrackWrapper = styled.div`
    display: flex;
    align-items: center;
    gap: 0.5rem;
    position: relative;
    padding-bottom: 1rem;
    border-bottom: 3px solid #e95578;
`;

export const NavButton = styled.button<{ direction: "left" | "right" }>`
    flex-shrink: 0;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    border: 2px solid #e7b7c2;
    background: #fff;
    color: #EC4899;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    font-size: 16px;
    transition: all 0.2s ease;
    z-index: 2;

    &:hover {
        background: #EC4899;
        color: #fff;
        border-color: #EC4899;
    }

    @media (max-width: 768px) {
        display: none;
    }
`;

export const CarouselTrack = styled.div`
    flex: 1;
    display: flex;
    gap: 1rem;
    overflow-x: auto;
    scroll-behavior: smooth;
    padding: 0.5rem 0.25rem 0.75rem;
    -webkit-overflow-scrolling: touch;

    /* esconde scrollbar visualmente mas mantém funcionalidade */
    scrollbar-width: thin;
    scrollbar-color: #e7b7c2 transparent;

    &::-webkit-scrollbar {
        height: 4px;
    }

    &::-webkit-scrollbar-track {
        background: transparent;
    }

    &::-webkit-scrollbar-thumb {
        background: #e7b7c2;
        border-radius: 4px;
    }

    /* Telas menores: deslizar com o dedo */
    @media (max-width: 768px) {
        gap: 0.75rem;
        scroll-snap-type: x proximity;
        padding: 0.5rem 0 0.75rem;
        padding-right: 3rem;

        & > * {
            scroll-snap-align: start;
        }
    }
`;
