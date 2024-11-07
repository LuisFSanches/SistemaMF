import styled from 'styled-components'

export const Container = styled.div`
    width: 100%;
    height: 100vh;
    .Payment-Table{
        caption{
                font-size: 1.3rem;
                text-align: start;
                margin-top: 0.3rem;
                margin-bottom: 0.2rem;
                font-weight: 600;
                color: var(--text-title)
            }
        border-spacing: 0.1rem 0.5rem;
           tbody{
                height: 23.5vh;
                display: block;
                overflow-y: scroll;
            }

    }
    .Table-Div{
        width: 3.2rem;
        height: 3.2rem;
        display: flex;
        justify-content: center;
        align-items: center;
        font-weight: 600;
        margin: 0 auto;
        position: relative;

        img{
            width: 3rem;
            height: 3rem;
            margin-top: 2px;
        }

        span{
            position: absolute;
            top: -2px;
            font-size: 1.3rem;
            color: var(--text-food-title);
            font-weight: 600;
        }
    }
`