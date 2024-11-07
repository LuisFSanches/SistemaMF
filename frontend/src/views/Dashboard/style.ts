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
`

export const Form = styled.form`
    width: 700px;
    height: 800px;
    background: var(--white-background);
    border-radius: 20px;
    box-shadow: 0.1rem 0.2rem 0.2rem var(--shadow-color);
`

export const FormField = styled.div`
    display: flex;
    flex-direction: column;
`;

export const Label = styled.label`
    font-size: 16px;
    color: #333;
    margin-bottom: 8px;
`;

export const Input = styled.input`
    padding: 12px;
    border: 1px solid #e7b7c2;
    border-radius: 8px;
    font-size: 16px;
    outline: none;
    &:focus {
        border-color: #d48a9b;
    }
`;