import styled from "styled-components";


export const Container = styled.div`
    max-width: 500px;
    width: 100%;
    min-height: 50px;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 8px;
    position: fixed;
    top: 20px;
    left: 50%;
    transform: translateX(-50%);
    background: #4caf50;
    text-align: center;
    font-size: 15px;
    font-weight: 500;
    color: white;
    z-index: 9999;
    border-radius: 12px;
    padding: 12px 24px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    
    p {
        margin: 0;
        line-height: 1.5;
        white-space: pre-line;
    }

    svg {
        flex-shrink: 0;
    }

    @media (max-width: 768px) {
        font-size: 14px;
        top: 15px;
        padding: 10px 20px;
    }
`;
