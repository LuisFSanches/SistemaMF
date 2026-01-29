import styled from 'styled-components'

export const Container = styled.div`
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 0 auto;
`

export const ResetPasswordForm = styled.div`
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

    .welcome-header {
        text-align: center;
        margin-top: 1.3rem;
        font-size: 1.5rem;
        color: var(--sideBarBackground);

        h1 {
            margin-bottom: 1.3rem;
        }

        img {
            width: 16rem;
            margin-top: 2rem;
        }
    }

    form {
        align-items: center;
        padding: 0 2rem;
        width: 100%;

        h3 {
            width: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-bottom: 1rem;
            font-size: 1.8rem;
            color: var(--sideBarBackground);
        }

        .description {
            text-align: center;
            color: var(--text-light);
            font-size: 0.95rem;
            margin-bottom: 1.5rem;
            line-height: 1.4;
        }

        .form-input {
            margin-bottom: 1rem;

            p {
                color: var(--text-light);
                font-size: 1.1rem;
                font-weight: 600;
                margin-bottom: 0.7rem;
            }

            .password-container {
                position: relative;
                width: 100%;

                input {
                    width: 100%;
                    padding: 1.2rem;
                    padding-right: 3rem;
                    border: 2px solid var(--primary-color);
                    outline: none;
                    border-radius: 0.7rem;
                }

                .eye-icon {
                    position: absolute;
                    right: 1rem;
                    top: 50%;
                    transform: translateY(-50%);
                    cursor: pointer;
                    color: var(--text-light);
                    font-size: 1.2rem;

                    &:hover {
                        color: var(--primary-color);
                    }
                }
            }

            .error {
                color: var(--danger-color);
                font-size: 0.9rem;
                display: block;
                margin-top: 0.5rem;
            }
        }

        button {
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
            transition: all 0.2s;
        }

        button:hover {
            background: #f5b1c1;
            color: #ffffffff;
            transform: scale(1.0);
            box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.25);
        }
    }

    a {
        color: var(--sideBarBackground);
        margin: 0.3rem 0;
    }

    .empty {
        margin-bottom: 1.2rem;
        color: #fff;
    }

    footer {
        width: 100%;
        justify-content: end;
        position: absolute;
        bottom: -3.8px;
    }

    @media (max-width: 650px) {
        height: 100%;
        width: 100%;
        border: none;

        form {
            h3 {
                margin-bottom: 1rem;
            }

            .form-input {
                margin-bottom: 1.5rem;
            }
        }
    }
`

export const ResetPasswordImage = styled.div`
    display: flex;

    img {
        width: 852px;
        height: 792px;
    }

    @media (max-width: 1450px) {
        img {
            width: 900px;
            height: 792px;
        }
    }

    @media (max-width: 1300px) {
        img {
            width: 800px;
            height: 792px;
        }
    }

    @media (max-width: 1200px) {
        img {
            width: 700px;
            height: 792px;
        }
    }

    @media (max-width: 1100px) {
        img {
            width: 600px;
            height: 792px;
        }
    }

    @media (max-width: 1080px) {
        img {
            display: none;
        }
    }
`
