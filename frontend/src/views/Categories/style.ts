import styled from 'styled-components'

export const Container = styled.div`
    height: 100vh;
   
    flex: 5;
    padding: 0.8rem 2rem;

    .add-button{
        display: flex;
        padding: 0.5rem;
        font-size: 1.1rem;
        border-radius: 0.4rem;
        margin-bottom: 0.8rem;

        p{
            margin-left: 0.3rem;
        }
    }
    .category-name{
            color: var(--text-food-title);
            font-weight: 600;
            align-items: center;
            text-align: center;
        }
 
    @media (max-width:750px){
        padding: 0.4rem;
        .table-image{
            width: 2.7rem;
            height: 2.7rem;
        }       
    }

`