import styled from "styled-components";

export const Container = styled.div`
    background: white;
    height: 400px;
    width: 90%;
    background:#F9F9F9;
    box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);

    &.second {
        background: #EAEAEA;
    }

    @media (max-width:1500px){
        width: 90%;
        height: 300px;
        margin-top: 25px;
    }
    @media (max-width:800px){
        width: 350px;
        height: 250px;
        margin-bottom: 2rem;
    }

`