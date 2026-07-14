import styled from "styled-components";

export const Container = styled.div`
    display: inline-block;
    margin-right: 15px;
`;

export const ModalContainer = styled.div`
    display: flex;
    gap: 20px;
    height: 85vh;
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

export const InfoField = styled.div`
    padding: 10px;
    border: 1px solid #e7b7c2;
    border-radius: 4px;
    font-size: 15px;
    background: #f5f5f5;
    color: #333;
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

export const PreviewCoupon = styled.div<{ $backgroundImage: string }>`
    width: 92%;
    max-width: 380px;
    aspect-ratio: 1024 / 1536;
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

export const PreviewContent = styled.div`
    height: 100%;
    width: 100%;
    position: relative;
    font-family: 'Arial', sans-serif;
    color: #4a3b34;

    .field-discount,
    .field-code,
    .field-validity {
        position: absolute;
        left: 34.7%;
        right: 8%;
        font-size: 65%;
        font-weight: bold;
        text-align: left;
        color: #4a3b34;
    }

    .field-discount {
        top: 58.3%;
    }

    .field-conditions {
        position: absolute;
        left: 34.7%;
        right: 8%;
        top: 62%;
        font-size: 32%;
        font-weight: normal;
        font-style: italic;
        text-align: left;
        color: #8a7b74;
    }

    .field-code {
        top: 69.5%;
    }

    .field-validity {
        top: 81%;
    }
`;

export const CouponWrapper = styled.div<{ $backgroundImage: string }>`
    width: 1024px;
    height: 1536px;
    background: white;
    background-image: url('/${props => props.$backgroundImage}');
    background-size: cover;
    background-repeat: no-repeat;
    background-position: center;
    position: relative;
    box-sizing: border-box;
    font-family: 'Arial', sans-serif;
    color: #4a3b34;
`;

export const CouponField = styled.div`
    position: absolute;
    left: 355px;
    right: 80px;
    font-size: 40px;
    font-weight: bold;
    text-align: left;
    color: #4a3b34;
    font-family: 'Arial', sans-serif;
`;

export const DiscountField = styled(CouponField)`
    top: 895px;
`;

export const ConditionsField = styled.div`
    position: absolute;
    left: 355px;
    right: 80px;
    top: 955px;
    font-size: 22px;
    font-weight: normal;
    font-style: italic;
    text-align: left;
    color: #8a7b74;
    font-family: 'Arial', sans-serif;
`;

export const CodeField = styled(CouponField)`
    top: 1065px;
`;

export const ValidityField = styled(CouponField)`
    top: 1250px;
`;
