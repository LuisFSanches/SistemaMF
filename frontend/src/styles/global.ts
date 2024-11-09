import  styled, {createGlobalStyle,} from 'styled-components'

export const GlobalStyle = createGlobalStyle`

:root{
    --background: #f7f2f2;
    --primary-color: #e4bfc7;
    --sideBarBackground: #e7b7c2;
    --light-background: #e4bfc7;
    --white-background: #fafafa;
    --black-background: #3E3E3E;
    --table-background: #f9f9f9;

    --red: #E52E40;
    --green:#33CC95;
    --blue:#18CECF;
    --orange:#e4742a;
    --light-orange:#fcf2eb;

    --text-white: #fff;
    --text-title: #666666;
    --text-light:#939393;
    --text-body: #323232;
    --text-food-title:#ccac00;

    --order-blue:#377BD1;
    --order-yellow:#EADC93;
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
            font-size: 1.3rem;
            font-weight: 600;
        }

        thead{
            height: 10px;
            width: calc(100% - 10px);
            background: #f3cbb1;
        }
        tbody{
            display: block;
            max-height: 85vh;
            overflow-y: scroll;
        }
        th, td {
            width: 8%;
            text-align: center;
            word-break:break-all
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
            background-color: #fcf2eb;
        }
        
        td{
            font-size: 1.15rem;
            text-align: center;
        }
        button{
            border: none;
            padding:0.5rem 0.5rem;
            font-size: 1.03rem;
            border-radius: 0.4rem;
        }

        img{
            width: 4rem;
            height: 4rem;
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
        background: var(--orange);
        color:var(--text-white);
        font-weight:600
}

.view-button{
        background: #66c1df;
        color: var(--text-white);
        font-weight:600
}

.react-modal-overlay{
    background: rgba(0,0,0,0.5);
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
}

.react-modal-content{
        width: 100%;
        max-width: 576px;
        background: var(--background);
        padding: 3rem;
        position: relative;
        border-radius: 0.25rem;
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
    justify-content: start;
`