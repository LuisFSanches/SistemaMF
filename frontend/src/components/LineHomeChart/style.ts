import styled from "styled-components";

export const Container = styled.div`
    background: white;
    height: 400px;
    width: 800px;
    background: var(--light-orange);

    @media (max-width:1600px){
        width: 610px;
        height: 220px;
    }
    @media (max-width:800px){
        width: 350px;
        height: 200px;
        margin-bottom: 1rem;
        margin-top: 1rem;
    }

`