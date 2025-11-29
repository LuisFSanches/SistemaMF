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
    --order-yellow: #f4d47c;
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

teste {
        font-family: 'Montserrat', sans-serif;
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
            font-size: 1.1rem;
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
            width: 10%;
            text-align: center;
            word-break:break-all
        }

        .description {
            width: 25%;
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
        
        td {
            font-size: 1.1rem;
            text-align: center;

            a {
                color: #EC4899;
                text-decoration: none;
                font-weight: 700;
            }
        }

        .delete-icon {
            button {
                background: none;

                svg {
                    color: red;
                }
            }
        }

        button{
            border: none;
            padding:0.5rem 0.5rem;
            font-size: 1.03rem;
            border-radius: 0.4rem;
            margin-right: 5px;
        }

        img{
            width: 4rem;
            height: 4rem;
        }

        @media (max-width: 1100px){
            th,td{
                font-size: 1rem;
            }
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

    input, select {
        width: 100%;
        padding: 12px;
        border-radius: 8px;
        border: 1px solid #e7b7c2;
        outline: none;
        font-size: 16px;
        background: var(--white-background);
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

.done-button {
    background: var(--order-green);
    color: var(--text-white);
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
    z-index: 999;
}

.react-modal-content{
    width: 100%;
    max-height: 95vh;
    overflow-y: auto;
    max-width: 576px;
    background: var(--background);
    padding: 2rem;
    position: relative;
    border-radius: 0.25rem;
    outline: none;

    @media (max-width: 768px){
        padding: 2rem;
    }
}

.react-modal-content-wide {
    width: 100%;
    max-width: 1200px;
    max-height: 95vh;
    background: var(--background);
    padding: 2rem;
    position: relative;
    border-radius: 0.25rem;
    outline: none;
    overflow: hidden;

    @media (max-width: 968px){
        max-width: 90%;
        padding: 1.5rem;
    }

    @media (max-width: 768px){
        max-width: 95%;
        padding: 1rem;
    }
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
    flex-direction: column;
    justify-content: start;
`

export const BodyContainer = styled.div`
    max-width: 100vw;
    display: flex;
`;

export const ModalContainer = styled.div`
    display: flex;
    flex-direction: column;

    h1 {
        font-size: 1.5rem;
    }

    h2{
        color: var(--text-title);
        font-size: 1.5rem;
        margin-bottom: 1rem;
    }

    input {
        padding: 0 1.5rem;
        height: 4rem;
        border-radius: 0.25rem;
        margin-bottom: 0.5rem;
    }

    select {
        margin-bottom: 0.5rem;
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

    .suggestion-box {
        position: absolute;
        top: 69px;
        left: 0;
        width: 100%;
        max-height: 200px;
        overflow-y: auto;
        background: white;
        border: 1px solid #e7b7c2;
        z-index: 10;
        list-style: none;
        padding: 0;
        margin: 0;
    }

    .suggestion-box li {
        padding: 8px;
        cursor: pointer;
    }

    .suggestion-box li:hover {
        background: #f5f5f5;
    }

    .custom-select-container {
        position: relative;
        width: 100%;
    }

    .custom-select-button {
        width: 100%;
        height: 4rem;
        padding: 12px;
        border: 1px solid #e7b7c2;
        border-radius: 8px;
        font-size: 16px;
        background: white;
        text-align: left;
        cursor: pointer;
        display: flex;
        justify-content: space-between;
        align-items: center;
        
        &:focus {
            outline: none;
            border-color: #d48a9b;
        }

        &.placeholder {
            color: #999;
        }
    }

    .custom-select-dropdown {
        position: absolute;
        top: 100%;
        left: 0;
        width: 100%;
        background: white;
        border: 1px solid #e7b7c2;
        border-radius: 8px;
        margin-top: 4px;
        z-index: 100;
        padding: 0;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }

    .custom-select-search {
        padding: 8px;
        border-bottom: 1px solid #e7b7c2;
        background: #fafafa;
        border-radius: 8px 8px 0 0;
        
        input {
            height: 40px;
            width: 100%;
            padding: 8px 12px;
            border: 1px solid #e7b7c2;
            border-radius: 6px;
            font-size: 14px;
            outline: none;
            
            &:focus {
                border-color: #d48a9b;
            }
        }
    }

    .custom-select-list {
        list-style: none;
        padding: 0;
        margin: 0;
        max-height: 245px;
        overflow-y: auto;
    }

    .custom-select-list li {
        padding: 12px;
        cursor: pointer;
        font-size: 16px;
        
        &:hover {
            background: #f5f5f5;
        }

        &.selected {
            background: var(--light-background);
            font-weight: 600;
        }

        &.no-results {
            color: #999;
            cursor: default;
            text-align: center;
            font-style: italic;
            
            &:hover {
                background: white;
            }
        }
    }

    .new-product-button, .new-supplier-button {
        max-width: 120px;
        background: none;
        text-align: left;
        color: #EC4899;
        font-weight: 700;
        font-size: 15px;
        margin-left: 5px;
        margin-bottom: 10px;
    }
`

export const FormField = styled.div<{ isShortField?: boolean }>`
    width: ${({ isShortField }) => (isShortField ? '35%' : '95%')};
    display: flex;
    flex-direction: column;
    margin: 20px 0 10px 0;
    position: relative;

    @media (max-width:768px) {
        width: ${({ isShortField }) => (isShortField ? '45%' : '100%')};
        padding: 0 8px;
    }
`;

export const FormFieldTitle = styled.div`
    display: flex;
    justify-content: center;
    margin-top: 20px;
    padding-bottom: 5px;
    font-family: 'Poppins', sans-serif;
    text-align: center;
    font-weight: 600;
`;

export const FormFieldsContainer = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
    border-radius: 10px;
    padding: 10px 15px;
    margin-top: 20px;

    div {
        width: 100% !important;
    }
`;

export const EditFormField = styled.div<{ isShortField?: boolean, removeMarginBottom?: boolean }>`
    width: 100% !important;
    width: ${({ isShortField }) => (isShortField ? '35%' : '85%')};
    display: flex;
    flex-direction: column;
    margin: 0 auto;
    margin-bottom: ${({ removeMarginBottom }) => (removeMarginBottom ? '0' : '10px')};
`;

export const InlineFormField = styled.div<{fullWidth?: boolean}>`
    width: ${({ fullWidth }) => (fullWidth ? '100%' : '95%')};
    display: flex;
    justify-content: space-between;

    div:first-child{
        margin-right: 10px;
    }

    @media (max-width: 768px){
        width: 100%;
        align-items: center;
        
        div:first-child {
            margin-right: 0px;
        }
    }
`

export const Label = styled.label<{ noMargin?: boolean }>`
    font-size: 16px;
    color: #5B5B5B;
    font-weight: 600;
    margin-bottom: ${({ noMargin }) => (noMargin ? '0' : '8px')};

    span {
        color: red;
        margin-left: 5px;
    }

    .label-question {
        border-radius: 50%;
        color: #EC4899;
        font-weight: 700;
        font-size: 23px;
        margin-left: 10px;
        position: absolute;
        left: 68px;
        top: -6px;
        background: none;
    }
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

export const CheckboxContainer =styled.div<{alignLeft?: boolean}>`
    display: flex;
    align-items: center;
    margin: 10px 0px;
    
    label {
        margin: 0px 10px;
    }

    @media (max-width: 768px){
        width: 100%;
        justify-content: start;
        margin-left: 20px;
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

export const PrimaryButton = styled.button`
    display: flex;
    align-items: center; 
    justify-content: center; 
    margin: 0 auto;
    margin-top: 20px;
    margin-bottom: 20px;
    padding: 12px; 
    border: none; 
    border-radius: 0.8rem;
    background: #EC4899;
    color: #fff;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer; 
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);

    &.next-button {
        margin-top: 20px;
    }

    &:hover {
        background: #f5b1c1; 
        transform: translateY(-2px); 
        box-shadow: 0 6px 8px rgba(0, 0, 0, 0.15); 
    }

    &:active {
        transform: translateY(0); 
        box-shadow: 0 3px 4px rgba(0, 0, 0, 0.2); 
    }

    
    @media (max-width: 768px) {
        margin-top: 0px;
        margin-bottom: 10px;
    }
`;

export const SecondaryButton = styled.button`
    display: flex;
    align-items: center; 
    justify-content: center; 
    margin: 0 auto;
    margin-top: 20px;
    margin-bottom: 20px;
    padding: 12px; 
    border: 2px solid #EC4899;
    border-radius: 0.8rem;
    background: transparent;
    color: #EC4899;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer; 
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);

    &:hover {
        background: #EC4899; 
        color: #fff;
        transform: translateY(-2px); 
        box-shadow: 0 6px 8px rgba(0, 0, 0, 0.15); 
    }

    &:active {
        transform: translateY(0); 
        box-shadow: 0 3px 4px rgba(0, 0, 0, 0.2); 
    }
    
    @media (max-width: 768px) {
        margin-top: 0px;
        margin-bottom: 10px;
    }
`;

export const PasswordContainer = styled.div`
    position: relative;

    svg {
        position: absolute;
        right: 25px;
        top: 25px;
    }
`

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
    margin-bottom: 1rem;
    align-items: center;

    .title {
        font-size: 22px;
        font-weight: 700;
        color: var(--text-title);

        svg {
            margin-right: 0.5rem;
        }
    }

    @media (max-width: 1100px) {
        flex-direction: column;

        div {
            display: flex;
            width: 100%;
            align-items: center;
            justify-content: center;

            input {
                width: 90% !important;
            }
        }
    }
`
export const ErrorMessage = styled.span`
    color: red;
    margin-bottom: 5px;
`
export const Switch = styled.div`
    display: flex;
    align-items: center;
    gap: 8px;
    margin-right: 25px;

    span {
        display: flex;
        align-items: center;
        font-size: 1rem;
        color: #333;
        text-align: center;
        font-weight: 600;
    }

    i {
        max-width: 30px;
        width: 30px;
    }

    input {
        opacity: 0;
        width: 0;
        height: 0;
        display: none;
    }
`;

export const StyledSwitch = styled.label<{ $checked: boolean }>`
    position: relative;
    display: inline-block;
    width: 48px;
    height: 24px;
    background-color: ${({ $checked }) => ($checked ? "#4caf50" : "#ccc")};
    border-radius: 24px;
    cursor: pointer;
    transition: background-color 0.3s;

    &::after {
        content: "";
        position: absolute;
        left: ${({ $checked }) => ($checked ? "24px" : "4px")};
        top: 4px;
        width: 16px;
        height: 16px;
        background: white;
        border-radius: 50%;
        transition: left 0.3s;
    }
`;

export const ProductContainer = styled.div<{ isEditModal: boolean }>`
    display: flex;
    width: ${({ isEditModal }) => (isEditModal ? '100%' : '85%')};
    margin: 0 auto;
    flex-direction: column;
    padding: 10px 15px;
    margin-top: 20px;

    .product-data {
        display: flex;
        align-items: center;
        gap: 10px;
        position: relative;

        div {
            display: flex;
            flex-direction: column;
        }
    }

    .suggestion-box {
        position: absolute;
        top: 69px;
        left: 0;
        width: 100%;
        max-height: 200px;
        overflow-y: auto;
        background: white;
        border: 1px solid #e7b7c2;
        border-radius: 10px;
        z-index: 10;
        list-style: none;
        padding: 0;
        margin: 0;
    }

    .suggestion-box li {
        padding: 8px;
        cursor: pointer;
    }

    .suggestion-box li:hover {
        background: #f5f5f5;
    }

    .product-actions {
        display: flex;
        justify-content: space-around;
        margin-top: 10px;
    }

    button {
        min-width: ${isEditModal => (isEditModal ? '50px' : '100px')};
        display: flex;
        align-items: center;
        justify-content: center;
        margin-top: 15px;
        padding: 10px 15px;
        border: none;
        border-radius: 10px;
        font-size: 16px;
        background: #e7b7c2;
        color: white;
        cursor: pointer;
        align-self: center;

        &.add-button {
            background: var(--green);
        }

        &.delete-button {
            background: red;
        }

        &.update-button {
            background: var(--blue);
        }
    }
`;

export const DescriptionArea = styled.div`
    display: flex;
    flex-direction: column;
    border: 1px solid #e7b7c2;
    padding: 10px 15px;
    border-radius: 10px;
    min-height: 100px;
    background: white;

    p {
        margin-bottom: 5px;

        button {
            margin-left: 10px;
            background: none;

            svg {
                color: red;
                font-size: 18px;
            }
        }
    }
`;
