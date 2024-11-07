import styled from 'styled-components'

export const Container = styled.div`
    width: 100%;
    height: 98vh;
    display: flex;
    flex-direction: column;
    flex: 5;
    overflow-y: hidden;
    overflow-x: hidden;

    @media (max-width:1450px){
    overflow-y: scroll;
    }

`

export const HeaderInfo = styled.div`
    width: 95%;
    height: 13vh;
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr;
    margin: 0 auto;
    grid-gap: 1rem;
    margin-top: 1rem;
    margin-left: 2rem;

    @media (max-width:1450px){
        height: 18vh;
    }

    @media (max-width:1350px){
        width: 100%;
        height: 58vh;
        grid-template-columns: 1fr 1fr;
        grid-gap: 0.5rem;
        justify-content: center;
        align-items: center;
        margin-left: 3rem;
    
    }
    @media (max-width:1050px){
        width: 100%;
        height: 55vh;
        grid-template-columns: 1fr 1fr;
        grid-gap: 0.5rem;
        justify-content: center;
        align-items: center;
        margin-left: 1rem;
        margin-top: 0;
        margin-bottom: 1rem;
    }

`

export const HeaderCard = styled.div`
    display: flex;
    flex-direction: column;
    width: 15rem;
    height: 7.5rem;
    background:#fff;
    border-radius: 0.95rem;
    box-shadow: 0.3rem 0.3rem 0.3rem 0.35rem #e5dcd1;

    .header-card-title{
        display: flex;
        justify-content: space-around;
        align-items: center;
        padding: 0.5rem;

        span{
            color: var(--text-body);
            font-size: 1.3rem;
        }
    }
    p{      
        width: 100%;
        display: flex;
        justify-content: end;
        padding: 0 0.7rem;
        color: var(--text-body);
        font-size: 1.6rem;
    }

    .header-icon{
        font-size: 2rem;
        color: #2E2B26;
    }

    footer{
        width: 100%;
    }

    @media (max-width:600px){
        width: 11rem;
        height: 5rem;
        .header-card-title{
            .header-icon{
                font-size: 1.2rem;
            }
            span{
                font-size: 1rem;
            }
        }
    }

`
export const ChartArea = styled.div`
    display: flex;
    height: 46vh;
    justify-content: space-around;
    padding: 1rem;
    margin-top: 1rem;

    @media (max-width:1500px){
        flex-direction: column;
        justify-content: center;
        align-items: center;
        margin-top: 0.5rem;
    }
    
    @media (max-width:600px){
        flex-direction: column;
        padding: 0;
    }
`

export const BottomInfo = styled.div`
    width: 100%;
    height: 18vh;
    display: flex;
    padding: 0.5rem 0.8rem;

    @media (max-width:1250px){
        flex-direction: column;
    }


`