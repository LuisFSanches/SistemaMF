import styled from "styled-components";

export const Container = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    h2 {
        margin-bottom: 5px;
    }

    button {
        width: 120px;
        display: flex;
        justify-content: center;
        padding: 10px;
        align-items: center;
        background: rgb(236, 72, 153);
        border-radius: 10px;
        text-align: center;
        margin-top: 20px;
        
        span {
            margin-right: 10px;
            font-size: 16px;
            color: white;
        }

        svg {
            color: white;
        }
    }
`;