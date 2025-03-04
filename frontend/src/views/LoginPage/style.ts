import styled from 'styled-components'

export const Container = styled.div`
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 0 auto;

`
export const LoginForm = styled.div`
    width: 28rem;
    height: 49.45rem;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    border: 2px solid var(--sideBarBackground);
    padding: 0;
 
    background: #fff;
    position: relative;

    .welcome-header{
        text-align: center;
        margin-top: 1.3rem;
        font-size: 1.5rem;
        color: var(--sideBarBackground);

        h1{
            margin-bottom: 1.3rem;
        }

        img{
            width: 16rem;
            margin-top: 2rem;
        }
    }
    form{
        align-items: center;

        h3{
        
            width: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-bottom: 1rem;
            font-size: 1.8rem;
            color: var(--sideBarBackground);
        
        }
        
        
        h2{
            width: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-bottom: 2.3rem;
            font-size: 2rem;
            color: var(--sideBarBackground);
        }

        .form-input{
            p{
                color: var(--text-light);
                font-size: 1.1rem;
                font-weight: 600;
                margin-bottom: 0.7rem;
            }
            input{
                width: 20rem;
                padding: 1.2rem;
                border: 2px solid var(--primary-color);
                outline: none;
                margin-bottom: 1.5rem;
                border-radius: 0.7rem;
            }
        }
        button{

            width: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
            text-align: center;
            padding: 0.8rem;
            border-radius: 0.8rem;
            margin-top: 0.5rem;
            background: var(--sideBarBackground);
            color: #ffffffff;
            font-size: 1.3rem;
            font-weight: 600;
        } 
    }  
        button:hover{

            background:#f5b1c1;
            color: #ffffffff;
            transform: scale(1.0);
            box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.25);

        }
        
    a{
        color: var(--sideBarBackground);
    }
    .empty{
        margin-bottom:1.2rem;
        color:#fff
    }
    footer{
            width: 100%;
            justify-content: end;
            position: absolute;
            bottom: -3.8px;
        }

    @media (max-width:650px){
        height: 100%;
        width: 100%;
        border: none;
        
        form{
            h2{
                margin-bottom: 3rem;
            }
            .form-input{
                input{
                    margin-bottom: 2rem;
                }
            }
        }
        
        
    }
`

export const LoginImage = styled.div`
    display: flex;
    img {
        width: 852px;
        height: 792px;
    }
    @media (max-width:1450px){
        img{
        width: 900px;
        height: 792px;
        }
    }
    @media (max-width:1300px){
        img{
        width: 800px;
        height: 792px;
        }
    }

    @media (max-width:1200px){
        img{
        width: 700px;
        height: 792px;
        }
    }
    @media (max-width:1100px){
        img{
        width: 600px;
        height: 792px;
        }
    }
    @media (max-width:1080px){
        img{
            display: none;
        }
    }

`