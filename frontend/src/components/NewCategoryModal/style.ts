import styled from "styled-components";

export const Container = styled.form`
        display: flex;
        flex-direction: column;

        h2{
            color: var(--text-title);
            font-size: 1.5rem;
            margin-bottom: 2rem;
        }
        input{
            width: 100%;
            padding: 0 1.5rem;
            height: 4rem;
            border-radius: 0.25rem;
            border: 1px solid #d7d7d7;
            font-weight: 400;
            font-size: 1rem;
            margin-bottom:1rem
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