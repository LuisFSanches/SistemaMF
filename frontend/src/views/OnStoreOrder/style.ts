import styled from 'styled-components'

export const Container = styled.div`
    width: 100%;
    height: 98vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    overflow-y: hidden;
    overflow-x: hidden;

    @media (max-width:1450px){
        overflow-y: scroll;
    }

    @media (max-width: 768px) {
        height: 100vh;
    }
`
export const FormHeader = styled.div`
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 20px;
    color: #e7b7c2;
    font-size: 18px;

    h2 {
        margin-left: 10px;
    }
`

export const Form = styled.form<{ step?: number }>`
    width: 700px;
    height: 800px;
    display: flex;
    flex-direction: column;
    align-items: center;
    background: ${({ step }) => (step === 4 ? '#FAF2E7' : 'white')};
    border-radius: 20px;
    box-shadow: 0.1rem 0.2rem 0.2rem var(--shadow-color);
    overflow-y: scroll;

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

    @media (max-width: 768px) {
        width: 100%;
        height: 100%;
        border-radius: 0px;
        border-radius: 0px;
    }
`

export const InlineFormField = styled.div`
    width: 85%;
    display: flex;
    justify-content: space-between;

    div:first-child{
        margin-right: 10px;
    }

    @media(max-width: 768px){
        width: 100%;
    }
`

export const StepButton = styled.button `
    display: flex;
    margin: 0 auto;
    margin-top: 20px;
    margin-left: 20px;
    padding: 0.8rem;
    border-radius: 0.8rem;
    background: var(--primary-color);
    color: #fff;
    font-size: 1.3rem;
    font-weight: 600;

    @media (max-width: 768px) {
        margin-top: 0px;
    }
`

export const ActionButtons = styled.div`
    display: flex;
    justify-content: center;
    margin: 20px 0;
`

export const CheckboxContainer = styled.div<{alignLeft?: boolean}>`
display: flex;
    align-items: left;
    margin: 20px 20px;
    align-self: ${({ alignLeft }) => (alignLeft ? 'flex-start' : 'flex-end')};    
  
    label {
        margin: 0 10px;
    }
`;

export const Checkbox = styled.input`
    width: 20px;
    height: 20px;
    appearance: none;
    border: 1px solid #e7b7c2;
    border-radius: 4px;
    outline: none;
    cursor: pointer;
    position: relative;
    transition: background-color 0.3s, border-color 0.3s;

    &:focus {
        border-color: #d48a9b;
        box-shadow: 0 0 0 2px rgba(212, 138, 155, 0.3);
    }

    &:checked {
        background-color: #d48a9b;
        border-color: #d48a9b;
    }

    &:checked::after {
        content: '✓';
        color: white;
        font-size: 19px;
        position: absolute;
        top: 1px;
        left: 4px;
    }

    &:hover {
        border-color: #d48a9b;
    }
`;

export const ErrorMessage = styled.span`
    color: red;
`

export const OrderSummary = styled.div`
    width: 50%;
    display: flex;
    flex-direction: column;
    margin-top: 30px;
    position: relative;

    h2 {
        margin-bottom: 5px;
    }

    div {
        border-bottom: 1px dashed black;
        margin-bottom: 10px;
    }

    p {
        padding: 5px 0;
    }

    svg {
        color: #e7b7c2;
        position: absolute;
        right: 0px;
        top: 0px;
        cursor: pointer;
    }

    .print {
        background: blue;
    }
`
