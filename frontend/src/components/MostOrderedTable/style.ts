import styled from 'styled-components'

export const Container = styled.div`
    width: 100%;
    height: 100vh;
    margin-right: 1rem;

    .Most-Ordered-Table{
            border-spacing: 0.1rem 0.5rem;
            caption{
                font-size: 1.3rem;
                text-align: start;
                margin-top: 0.2rem;
                margin-bottom: 0.2rem;
                font-weight: 600;
                color: var(--text-title)
            }
            tbody{
                height: 23.5vh;
                display: block;
                overflow-y: scroll;
            }
            img{
                width: 3.5rem;
                height: 3.5rem;
            }
    }

   
`