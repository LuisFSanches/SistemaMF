import styled from "styled-components";

export const Container = styled.div`
    display: inline-block;
    margin-right: 15px;
`;

export const ModalContainer = styled.div`
    display: flex;
    gap: 20px;
    height: 82vh;
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

export const PreviewCard = styled.div<{ $backgroundImage: string }>`
    width: 92%;
    max-width: 500px;
    aspect-ratio: 1 / 3;
    background: white;
    background-image: url('/${props => props.$backgroundImage}');
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
    margin-top: 80px;
    margin-left: 85px;
    align-items: flex-start;
    font-size: ${props => props.fontSize}px;
    font-family: 'Times New Roman', serif;
    color: #333;
    line-height: 1.6;
    word-wrap: break-word;
    overflow-y: auto;

    .logo-top {
        position: absolute;
        top: 5px;
        left: 50%;
        transform: translateX(-50%);
        max-width: 105px;
        max-height: 80px;
        object-fit: contain;
    }

    .bottom-section {
        position: absolute;
        bottom: 5px;
        left: 50%;
        transform: translateX(-50%);
        display: flex;
        align-items: center;
        gap: 4px;
    }

    .logo-bottom {
        max-width: 105px;
        max-height: 70px;
        object-fit: contain;
        flex-shrink: 0;
        border-right: 1px solid #000000;
        padding-right: 0px;
    }

    .store-info {
        display: flex;
        flex-direction: column;
        gap: 6px;
        font-size: 9px;
        font-family: 'Arial', sans-serif;
    }

    .store-info-item {
        display: flex;
        align-items: center;
        gap: 2px;
        
        svg {
            width: 11px;
            height: 11px;
            color: #333;
        }
    }

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
        line-height: 18px;
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

export const TemplateSelector = styled.div`
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 12px;
    width: 100%;
`;

export const TemplateOption = styled.div<{ $isSelected: boolean }>`
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    padding: 10px;
    border: 2px solid ${props => props.$isSelected ? '#66c1df' : '#e7b7c2'};
    border-radius: 8px;
    cursor: pointer;
    background: ${props => props.$isSelected ? '#f0f9ff' : 'white'};
    transition: all 0.2s;

    &:hover {
        border-color: #66c1df;
        transform: translateY(-2px);
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }

    img {
        width: 100%;
        object-fit: contain;
        border-radius: 4px;
    }

    span {
        font-size: 12px;
        font-weight: ${props => props.$isSelected ? '600' : '400'};
        color: ${props => props.$isSelected ? '#66c1df' : '#666'};
    }
`;
export const CardWrapper = styled.div<{ $backgroundImage: string }>`
    width: 595px;
    height: 830px;
    background: white;
    background-image: url('/${props => props.$backgroundImage}');
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center;
    padding: 120px 110px;
    font-family: 'Times New Roman', serif;
    position: relative;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    color: #363636;
    letter-spacing: 0.02em;
    line-height: 20px;
`;

export const LogoTop = styled.img`
    position: absolute;
    top: 20px;
    left: 50%;
    transform: translateX(-50%);
    max-width: 115px;
    max-height: 90px;
    object-fit: contain;
`;

export const StoreInfoContainer = styled.div`
    position: absolute;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    align-items: center;
    gap: 5px;
    font-size: 11px;
    color: #333;

    img {
        max-width: 80px;
        max-height: 80px;
        object-fit: contain;
        border-right: 1px solid #000000;
        padding-right: 5px;
    }

    .store-info {
        display: flex;
        flex-direction: column;
        gap: 6px;

        span, svg {
            font-size: 9px;
        }
    }
`;

export const StoreInfoItem = styled.div`
    display: flex;
    align-items: center;
    gap: 5px;
    
    svg {
        width: 12px;
        height: 12px;
        color: #333;
    }
    
    span {
        font-family: 'Arial', sans-serif;
        font-size: 11px;
    }
`;

export const ContentWrapper = styled.div`
    flex: 1;
    display: flex;
    flex-direction: column;
`;

export const CardFrom = styled.div<{ fontSize: number }>`
    font-size: ${props => props.fontSize}px;
    margin-bottom: 10px;
    color: #000;
    line-height: 1.3;
    font-style: italic;
`;

export const CardTo = styled.div<{ fontSize: number }>`
    font-size: ${props => props.fontSize}px;
    margin-bottom: 25px;
    color: #000;
    line-height: 1.3;
    font-style: italic;
`;

export const CardMessage = styled.div<{ fontSize: number }>`
    font-size: ${props => props.fontSize}px;
    line-height: 20px;
    white-space: pre-wrap;
    word-wrap: break-word;
    color: #000;
    max-width: 100%;
`;

export const OrderCode = styled.div`
    position: absolute;
    bottom: 10px;
    left: 240px;
    font-size: 13px;
    color: #000;
    font-style: italic;
`;
