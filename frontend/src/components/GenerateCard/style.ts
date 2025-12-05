import styled from "styled-components";

export const Container = styled.div`
    display: inline-block;
    margin-right: 15px;
`;

export const ModalContainer = styled.div`
    display: flex;
    gap: 20px;
    height: 80vh;
    max-width: 1200px;
    width: 100%;

    @media (max-width: 968px) {
        flex-direction: column;
        height: auto;
    }
`;

export const EditorSection = styled.div`
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 15px;
    padding: 20px;
    background: #f8f9fa;
    border-radius: 8px;
    overflow-y: auto;

    h2 {
        color: var(--text-title);
        margin-bottom: 10px;
        font-size: 20px;
    }
`;

export const PreviewSection = styled.div`
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 15px;
    padding: 20px;
    background: #ffffff;
    border-radius: 8px;
    align-items: center;
    justify-content: center;
    position: relative;
`;

export const FormGroup = styled.div`
    display: flex;
    flex-direction: column;
    gap: 8px;

    label {
        font-weight: 600;
        color: var(--text-title);
        font-size: 14px;
    }
`;

export const Input = styled.input`
    padding: 10px;
    border: 1px solid #e7b7c2;
    border-radius: 4px;
    outline: none;
    font-size: 15px;
    transition: border-color 0.2s;

    &:focus {
        border-color: #66c1df;
    }
`;

export const TextArea = styled.textarea`
    width: 100%;
    height: 120px;
    padding: 10px;
    border: 1px solid #e7b7c2;
    border-radius: 4px;
    resize: vertical;
    outline: none;
    font-size: 15px;
    transition: border-color 0.2s;

    &:focus {
        border-color: #66c1df;
    }
`;

export const FontSizeControl = styled.div`
    display: flex;
    align-items: center;
    gap: 10px;

    label {
        font-weight: 600;
        color: var(--text-title);
        font-size: 14px;
    }

    button {
        width: 32px;
        height: 32px;
        border: 1px solid #e7b7c2;
        background: white;
        border-radius: 4px;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.2s;

        &:hover {
            background: #f0f0f0;
        }

        &:active {
            transform: scale(0.95);
        }
    }

    input {
        width: 60px;
        padding: 8px;
        border: 1px solid #e7b7c2;
        border-radius: 4px;
        text-align: center;
        outline: none;
        font-size: 14px;
    }

    span {
        font-size: 14px;
        color: #666;
    }
`;

export const PreviewCard = styled.div`
    width: 100%;
    max-width: 500px;
    aspect-ratio: 1 / 3;
    background: white;
    background-image: url('/card_background.png');
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center;
    border: 2px solid #e7b7c2;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    position: relative;
    overflow: hidden;
`;

export const PreviewContent = styled.div<{ fontSize: number }>`
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    margin-top: 70px;
    margin-left: 85px;
    align-items: flex-start;
    font-size: ${props => props.fontSize}px;
    font-family: 'Times New Roman', serif;
    color: #333;
    line-height: 1.6;
    word-wrap: break-word;
    overflow-y: auto;

    .card-to {
        font-style: italic;
        margin-bottom: 5px;
        font-size: ${props => props.fontSize * 0.9}px;
    }

    .card-message {
        max-width: 80%;
        margin: 15px 0;
        white-space: pre-wrap;
        font-size: ${props => props.fontSize * 0.85}px;
        text-align: left;
    }

    .card-from {
        font-style: italic;
        margin-top: 5px;
        font-size: ${props => props.fontSize * 0.9}px;
    }
`;

export const Button = styled.button`
    padding: 12px 24px;
    background: #66c1df;
    color: white;
    border: 1px solid #eeeeee;
    border-radius: 10px;
    cursor: pointer;
    font-size: 14px;
    font-weight: bold;
    transition: all 0.2s;

    &:hover {
        opacity: 0.9;
        transform: translateY(-1px);
    }

    &:active {
        transform: translateY(0);
    }

    svg {
        margin-right: 8px;
    }

    @media (max-width: 768px) {
        padding: 6px 12px;
    }
`;

export const PrintButton = styled(Button)`
    width: 100%;
    margin-top: auto;
    background: #EC4899;

    &:hover {
        background: #EF6CAD;
    }
`;