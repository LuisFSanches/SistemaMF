import styled from "styled-components";

export const ModalContainer = styled.div`
    display: flex;
    flex-direction: column;
    height: 100%;
`;

export const ModalHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px;
    border-bottom: 1px solid #e0e0e0;

    div {
        display: flex;
        align-items: center;
        gap: 10px;

        svg {
            color: var(--primary-color);
            font-size: 24px;
        }

        span {
            font-size: 20px;
            font-weight: 600;
            color: #333;
        }
    }
`;

export const CloseButton = styled.button`
    background: none;
    border: none;
    font-size: 24px;
    color: #666;
    cursor: pointer;
    padding: 5px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: color 0.2s;

    &:hover {
        color: #333;
    }
`;

export const ModalBody = styled.div`
    flex: 1;
    padding: 20px;
    overflow-y: auto;
`;

export const ScannerContainer = styled.div`
    position: relative;
    width: 100%;
    max-width: 500px;
    margin: 0 auto;
    border-radius: 8px;
    overflow: hidden;
    background: #000;
    min-height: 400px;
    display: flex;
    align-items: center;
    justify-content: center;
`;

export const ScannerPreview = styled.div`
    width: 100%;
    
    video {
        width: 100%;
        height: auto;
        border-radius: 8px;
    }

    #qr-shaded-region {
        border: 2px solid var(--primary-color) !important;
    }
`;

export const ScannerInfo = styled.div`
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    text-align: center;
    color: #fff;
    z-index: 10;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 15px;

    svg {
        color: var(--primary-color);
    }

    p {
        font-size: 16px;
        margin: 0;
        text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
    }
`;

export const ActionButton = styled.button`
    background-color: var(--primary-color);
    color: #fff;
    border: none;
    padding: 10px 20px;
    border-radius: 5px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: opacity 0.2s;

    &:hover {
        opacity: 0.9;
    }
`;
