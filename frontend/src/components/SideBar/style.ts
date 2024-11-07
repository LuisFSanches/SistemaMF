import styled from 'styled-components'

interface MinimizedSideBar{
    isMinimizedActive:boolean
}

export const Container = styled.div<MinimizedSideBar>`
    flex: 0;
    max-height: 100%;
    height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    background: var(--sideBarBackground);

    width: ${(props)=>props.isMinimizedActive
        ? 4
        :30
    }rem;


    @media (max-width: 750px) {     
        align-items: center;
        width: 4rem;
    }
    
    @media (max-width:550px){
        flex: 0;
        width: 3rem;
    }

`

export const SideBarItemContainer = styled.div`
    width: 100%;
    padding:0.35rem 1rem;
`

export const LogoContainer = styled.div<MinimizedSideBar>`
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.75rem 1rem;
    margin-bottom: 0.4rem;
    //margin-top: 0.8rem;
    background: var(--primary-color);

    .logo-info {
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    p{
        font-size: 1.5rem;
        font-weight: 600;
        color: var(--white-background);
        display: ${(props)=>props.isMinimizedActive
            ? 'none'
            : 'flex'
        };
    }
    
    img{
        width: 7rem;
        height: 4rem;
    }

    @media (max-width: 750px) {
        align-items: center;
        justify-content: center;
        padding: 0.5rem 0rem;
        margin-bottom: 0rem;
        img{
            width: 2.3rem;
            height: 2.3rem;
        }
        p{
            display: none;
        }
        .close-side-bar-menu{
            display: none;
        }
    }

`

export const MinimizeButton = styled.div`
    width: 100%;
    display: flex;
    justify-content: center;

    .close-side-bar-menu{
        background: transparent;
        font-size: 1.5rem;
        color: var(--white-background);
    }

    @media (max-width: 750px) {
        .close-side-bar-menu{
            display: none;
        }
    }
`

interface SideBarButtonProps{
    isActive: boolean
    isMinimizedActive:boolean
}
export const SideBarButton = styled.button<SideBarButtonProps>`
    width: ${(props)=>props.isMinimizedActive 
        ?3
        :15
    }rem;
    display: flex;
    align-items: center;
    justify-content: ${(props)=>props.isMinimizedActive
        ? 'center'
        : 'start'
    }
    ;
    color: var(--text-body);
    padding: 1rem 0.4rem;
    border-radius: 0.4rem;
    
    span{
        font-size: 1.3rem;
        margin-left: 1rem;
        font-weight: 600;
        align-items: center;
        display: ${(props)=>props.isMinimizedActive
            ? 'none'
            : 'flex'
        }

    }

    background: ${(props)=>props.isActive
        ? 'var(--white-background)'
        :'transparent'
    };
     .Side-Bar-Icon{
         font-size: 1.6rem;
        
     }

@media (max-width: 750px) {
    align-items: center;
    justify-content: center;
    width: 80%;
    padding: 0;
    margin-left: 0.2rem;
        span{
            display: none;
        }
        .Side-Bar-Icon{
        font-size: 1.4rem;
         padding: 0.7rem;
         
     }
    }

`
export const CompanyInfoContainer = styled.div<MinimizedSideBar>`
    width: 100%;
    display: flex;
    flex-direction: ${(props)=>props.isMinimizedActive
        ?'column'
        :'row'
    };
    justify-content: space-around;
    padding: 0.5rem 1rem;
    background: var(--primary-color);

    .company-info{
        display: flex;
        flex-direction: column;
        align-items: center;

        p{
            font-size: 1.1rem;
            color: var(--white-background);
            display: ${(props)=>props.isMinimizedActive
                ?'none'
                : 'flex'
            };
        }
    }

    img{
        width: ${(props)=>props.isMinimizedActive
            ? 2.7
            : 4
        }rem;
        height: ${(props)=>props.isMinimizedActive
            ? 2.7
            : 4
        }rem;
    }

    .logout-icon{
        display: ${(props)=>props.isMinimizedActive
            ? 'none'
            : 'flex'
        };
    }

    button{
        font-size: 1.25rem;
        color: var(--white-background);
        background: transparent;

        p{  
            font-size: 1.15rem;
            margin-top: 0.3rem;
        }
    }

    @media(max-width:750px){
        align-items: center;
        flex-direction: column;
        .company-info{
            img{
                width: 2.7rem;
                height: 2.7rem;
            }
            p{
                display: none;
            }
        }
        .logout-button{
            .logout-icon{
                display: none;
            }
            p{
                margin-top: 1.2rem;
            }
        }
        
    }


`