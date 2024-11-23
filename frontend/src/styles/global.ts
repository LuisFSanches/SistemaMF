import  styled, {createGlobalStyle,} from 'styled-components'

export const GlobalStyle = createGlobalStyle`

:root{
    --background: #f7f2f2;
    --primary-color: #e4bfc7;
    --sideBarBackground: #e7b7c2;
    --light-background: #E9CBD2;
    --tbody-background: #F4E5E8;
    --white-background: #fafafa;
    --black-background: #3E3E3E;
    --table-background: #f9f9f9;

    --red: #E52E40;
    --green:#33CC95;
    --blue:#18CECF;
    --light-orange:var(--tbody-background);

    --text-white: #fff;
    --text-title: #666666;
    --text-light:#939393;
    --text-body: #323232;
    --text-food-title:#ccac00;

    --order-blue:#377BD1;
    --order-yellow:#EADC93;
    --order-green:#6aa84f;

    --shadow-color: #abb5bc
}

*{
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

html{
    @media(max-width: 1080px){
    font-size: 93.75%; // 15px
    }
    @media(max-width: 720px){
        font-size: 87.5%;
    }
}

body, input, textarea, button{
    font-family: 'Poppins',sans-serif;
    font-weight: 500;
}

h1,h2,h3,h4,h5, strong{
    font-weight: 600;
}

a{
    outline: none;
    text-decoration: none;
}

body{
    background: var(--background);
    -webkit-font-smoothing:antialiased;
}

table{
        width: 100%;
        background:var(--table-background);
        border-spacing: 0.3rem 1.0rem;
        border: 1px solid var(--shadow-color);
        box-shadow: 0.2rem 0.3rem var(--shadow-color);
        
        th{
            text-align: center;
            color: var(--text-title);
            font-size: 1.3rem;
            font-weight: 600;
        }

        thead{
            height: 10px;
            width: calc(100% - 10px);
            background: var(--light-background);
        }
        tbody{
            display: block;
            max-height: 85vh;
            overflow-y: scroll;
        }
        th, td {
            width: 8%;
            text-align: center;
            word-break:break-all
        }
        .table-item-id{
            width: 5%;
        }
        tr{
            display: table;
            width: 100%;
            align-items: center;
            text-align: center;
        }
        tr:nth-child(even) {
            background-color: var(--tbody-background);
        }
        
        td{
            font-size: 1.15rem;
            text-align: center;
        }
        button{
            border: none;
            padding:0.5rem 0.5rem;
            font-size: 1.03rem;
            border-radius: 0.4rem;
        }

        img{
            width: 4rem;
            height: 4rem;
        }
        
        @media (max-width: 750px){
            th,td{
                font-size: 0.98rem;
            }
            tbody{
                overflow-x: auto;
            }
            .table-item-id{
                display: none
            };
            .table-icon{
                width: 4.2%;
                span{
                    display: none;
                }
            }
        }
        
    }

    input {
        width: 100%;
        padding: 12px;
        border-radius: 8px;
        border: 1px solid #e7b7c2;
        outline: none;
        font-size: 16px;
    }

button{
    cursor: pointer;
    outline: none;
    border: none;
    
}
.add-button{
    background: var(--green);
    color:var(--text-white);
    font-weight:600
}

.edit-button{
    background: var(--blue);
    color:var(--text-white);
    font-weight:600
}

.del-button{
    background: var(--red);
    color:var(--text-white);
    font-weight:600
}

.create-button{
    background: var(--sideBarBackground);
    color:var(--text-white);
    font-weight:600
}

.view-button{
        background: #66c1df;
        color: var(--text-white);
        font-weight:600
}

.react-modal-overlay{
    background: rgba(0,0,0,0.25);
    width: 100vw;
    height: 100vh;
    position: fixed;
    top: 0;
    border: 0;
    right: 0;
    left: 0;
    display: flex;
    align-items: center;
    justify-content: center;
}

.react-modal-content{
    width: 100%;
    max-width: 576px;
    background: var(--background);
    padding: 3rem;
    position: relative;
    border-radius: 0.25rem;
}

.react-modal-content-edit-order {
    width: 100%;
    max-height: 835px;
    max-width: 800px;
    background: var(--background);
    padding: 3rem;
    position: relative;
    border-radius: 0.25rem;

    overflow-y: scroll;
    overflow-x: hidden;

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
}
.modal-close{
        position: absolute;
        right:1.5rem ;
        top: 1.5rem;
        font-size: 1.25rem;
        background:transparent;
        color:var(--text-title);
        transition:filter 0.2s;

        &:hover{
            filter: brightness(0.7);
        }
    }
`

export const PageContainer = styled.div`
    max-width: 100vw;
    display: flex;
    justify-content: start;
`

export const ModalContainer = styled.div`
    display: flex;
    flex-direction: column;

    h2{
        color: var(--text-title);
        font-size: 1.5rem;
        margin-bottom: 2rem;
    }

    input {
        padding: 0 1.5rem;
        height: 4rem;
        border-radius: 0.25rem;
        margin-bottom: 1rem;
    }

    input[type="checkbox"] {
        width: 20px;
        height: 20px;
        padding: 12px;
        margin-bottom: 0px;
    }

    button[type="submit"]{
        width: 100%;
        padding:0 1.5rem;
        height: 4rem;
        margin-top: 0.5rem;
        font-size: 1.1rem;
        transition: filter 0.2s;
        border-radius: 0.3rem;

            &:hover{
                filter: brightness(1.2);
            }
    }
`

export const Form = styled.form`
    display: flex;
    flex-direction: column;
`

export const FormField = styled.div<{ isShortField?: boolean }>`
    width: 85%;
    width: ${({ isShortField }) => (isShortField ? '35%' : '85%')};
    display: flex;
    flex-direction: column;
    margin: 0 auto;
    margin-bottom: 10px;
    margin-top: 20px;
`;

export const EditFormField = styled.div<{ isShortField?: boolean }>`
    width: 100% !important;
    width: ${({ isShortField }) => (isShortField ? '35%' : '85%')};
    display: flex;
    flex-direction: column;
    margin: 0 auto;
    margin-bottom: 10px;
    margin-top: 20px;
`;

export const InlineFormField = styled.div`
    width: 100%;
    display: flex;
    justify-content: space-between;

    div:first-child{
        margin-right: 10px;
    }
`

export const Label = styled.label`
    font-size: 16px;
    color: #5B5B5B;
    font-weight: 600;
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

export const Select = styled.select<{ isEditField?: boolean }>`
    height: ${({ isEditField }) => (isEditField ? '4rem' : 'auto')};
    padding: 12px;
    border: 1px solid #e7b7c2;
    border-radius: 8px;
    font-size: 16px;
    outline: none;
    &:focus {
        border-color: #d48a9b;
    }
        
    background: white;
`

export const Textarea = styled.textarea`
    min-height: 120px;
    padding: 12px;
    border: 1px solid #e7b7c2;
    border-radius: 8px;
    font-size: 16px;
    outline: none;
    &:focus {
        border-color: #d48a9b;
    }
`;

export const CheckboxContainer = styled.div`
    display: flex;
    align-items: center;
    margin: 10px 0px;
    
    label {
        margin: 0px 10px;
    }
`;

export const Checkbox = styled.input`
    max-width: 20px;
    max-height: 20px;
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

export const AddButton = styled.button`
    display: flex;
    padding: 0.5rem;
    background: var(--sideBarBackground);
    font-size: 1.1rem;
    border-radius: 0.4rem;
    margin-bottom: 0.8rem;
    color: white;
    font-weight: 700;

    p {
        margin-left: 0.3rem;
        
    }
`
export const PageHeader = styled.div`
    display: flex;
    justify-content: space-between;
`
export const ErrorMessage = styled.span`
    color: red;
    margin-bottom: 5px;
`