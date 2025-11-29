import styled from "styled-components";

export const Container = styled.div`
    width: 100%;
    height: 98vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    overflow-y: hidden;
    overflow-x: hidden;
    padding-left: 7px;

    @media (max-width:1450px){
        overflow-y: scroll;
    }

    @media (max-width: 768px) {
        height: 100vh;
    }
`;

export const Form = styled.form`
    width: 700px;
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 30px;
    border-radius: 20px;
    overflow-y: scroll;
    overflow-x: hidden;
    background: #FFFFFF;

    .spacer {
        width: 100%;
        height: 30px;
        background: #f7f2f2;
        padding: 7px;
    }

    .client-container-title {
        width: 100%;
        display: flex;
        justify-content: center;
        padding: 10px;
        font-size: 22px;
        font-weight: bold;
        background: linear-gradient(
            135deg,
            rgba(255, 230, 240, 0.7),
            #faf6ff
        );
        );
    }

    .order-info {
        width: 90%;
        padding: 20px;
        background: #f9f9f9;
        border-radius: 10px;
        margin: 20px 0px 8px 0px;
        border: 1px solid #ddd;

        p {
            margin: 5px 0;
            font-size: 16px;
            color: #333;
        }
    }

    ::-webkit-scrollbar {
        width: 8px;
    }

    ::-webkit-scrollbar-track {
        background: #f1f1f1;
        border-radius: 10px;
    }

    ::-webkit-scrollbar-thumb {
        background: #fcc5d0;
        border-radius: 10px;
    }

    ::-webkit-scrollbar-thumb:hover {
        background: #a1a1a1;
    }

    @media (max-width:768px){
        width: 100%;
        height: 100%;
        margin-top: 0px;
        border-radius: 0px;
    }
`;

export const FormHeader = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background: #f7f2f2;
    padding-bottom: 20px;
    padding-top: 10px;

    img {
        width: 70px;
        height: 70px;
        background: white;
        border-radius: 50%;
        box-shadow: 
        0 10px 15px -3px rgba(0, 0, 0, 0.1),
        0 4px 6px -4px rgba(0, 0, 0, 0.1);
    }

    p {
        font-size: 18px;
        font-weight: bold;
        margin-top: 10px;
        color: #333;
    }

    span {
        font-size: 14px;
        color: #666;
        margin-top: 2px;
    }
`;

export const FormFieldsContainer = styled.div`
    width: 90%;
    display: flex;
    flex-direction: column;
    gap: 20px;
    margin-bottom: 30px;
`;

export const FormField = styled.div`
    display: flex;
    flex-direction: column;
    gap: 8px;
`;

export const Label = styled.label`
    font-size: 14px;
    font-weight: 600;
    color: #333;

    span {
        color: #e74c3c;
        margin-left: 4px;
    }
`;

export const Input = styled.input`
    padding: 12px;
    border: 1px solid #ddd;
    border-radius: 8px;
    font-size: 14px;
    transition: border-color 0.3s;

    &:focus {
        outline: none;
        border-color: var(--primary-color);
    }

    &:disabled {
        background-color: #f5f5f5;
        cursor: not-allowed;
    }
`;

export const CompletedDelivery = styled.div`
    width: 700px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin-top: 50px;
    padding: 40px;
    background: white;
    border-radius: 20px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);

    img {
        width: 100px;
        height: 100px;
        margin-bottom: 20px;
    }

    h1 {
        font-size: 28px;
        color: #27ae60;
        margin-bottom: 10px;
        text-align: center;
    }

    h2 {
        font-size: 18px;
        color: #666;
        text-align: center;
        margin-bottom: 10px;
    }

    p {
        font-size: 32px;
        margin-top: 10px;
    }

    @media (max-width: 768px) {
        width: 90%;
        padding: 20px;

        h1 {
            font-size: 22px;
        }

        h2 {
            font-size: 16px;
        }
    }
`;

export const DeliveryManInfo = styled.div`
    width: 100%;
    padding: 15px;
    margin-top: 10px;
    display: flex;
    align-items: center;
    gap: 15px;

    background: #f0fff4;
    border: 2px solid #27ae60;
    border-radius: 12px;

    .avatar {
        width: 55px;
        height: 55px;
        border-radius: 50%;
        background: #d1f5d3;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 20px;
        font-weight: bold;
        color: #1e7a3c;
    }

    .info strong {
        color: #27ae60;
    }

    p {
        margin: 3px 0;
        font-size: 15px;
        color: #333;
    }
`;

export const SubmitButton = styled.button`
    width: 100%;
    padding: 14px;
    background: #d63384;
    color: white;
    border: none;
    border-radius: 8px;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s;

    &:hover:not(:disabled) {
        opacity: 0.9;
        transform: translateY(-2px);
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    }

    &:disabled {
        background: #999999;
        cursor: not-allowed;
        opacity: 0.6;
    }
`;
