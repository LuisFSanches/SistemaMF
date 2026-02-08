import styled from 'styled-components';

export const Container = styled.div`
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 0 auto;
`;

export const RegistrationForm = styled.div`
    width: 36rem;
    height: auto;
    max-height: 90vh;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    border: 2px solid var(--sideBarBackground);
    padding: 0;
    padding-bottom: 4rem;
    background: #fff;
    position: relative;

    /* Custom scrollbar */
    &::-webkit-scrollbar {
        width: 8px;
    }

    &::-webkit-scrollbar-track {
        background: #f1f1f1;
    }

    &::-webkit-scrollbar-thumb {
        background: var(--sideBarBackground);
        border-radius: 4px;
    }

    &::-webkit-scrollbar-thumb:hover {
        background: var(--primary-color);
    }

    .welcome-header {
        text-align: center;
        margin-top: 1.3rem;
        font-size: 1.5rem;
        color: var(--sideBarBackground);

        h1 {
            margin-bottom: 1.3rem;
        }

        img {
            width: 12rem;
            margin-top: 1rem;
        }
    }

    form {
        width: 100%;
        padding: 0 2rem;
        align-items: center;

        h3 {
            width: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-bottom: 1rem;
            margin-top: 1rem;
            font-size: 1.8rem;
            color: var(--sideBarBackground);
        }

        h4.section-title {
            width: 100%;
            font-size: 1.3rem;
            color: var(--sideBarBackground);
            margin-top: 1.5rem;
            margin-bottom: 0.8rem;
            padding-bottom: 0.5rem;
            border-bottom: 2px solid var(--primary-color);
        }

        .form-row {
            display: flex;
            gap: 1rem;
            width: 100%;

            @media (max-width: 650px) {
                flex-direction: column;
                gap: 0;
            }
        }

        .form-input {
            flex: 1;
            margin-bottom: 1rem;

            &.full-width {
                width: 100%;
                flex: none;
            }

            &.flex-2 {
                flex: 2;
            }

            p {
                color: var(--text-light);
                font-size: 1rem;
                font-weight: 600;
                margin-bottom: 0.5rem;

                span {
                    color: red;
                }
            }

            input, textarea, select {
                width: 100%;
                padding: 1rem;
                border: 2px solid var(--primary-color);
                outline: none;
                border-radius: 0.7rem;
                font-family: 'Poppins', sans-serif;
                font-size: 0.95rem;

                &::placeholder {
                    color: #bbb;
                }

                &:focus {
                    border-color: var(--sideBarBackground);
                }
            }

            select {
                cursor: pointer;
                background-color: white;
            }

            textarea {
                resize: vertical;
                min-height: 60px;
                font-family: 'Poppins', sans-serif;
            }
        }

        .logo-upload-section {
            width: 100%;
            margin: 1.5rem 0;

            .section-title {
                font-size: 1.3rem;
                color: var(--sideBarBackground);
                margin-bottom: 1rem;
                padding-bottom: 0.5rem;
                border-bottom: 2px solid var(--primary-color);
            }

            .logo-upload-box {
                width: 100%;
                min-height: 150px;
                border: 2px dashed var(--primary-color);
                border-radius: 0.7rem;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                gap: 0.5rem;
                cursor: pointer;
                padding: 1.5rem;
                background: var(--white-background);
                transition: all 0.2s;

                &:hover {
                    border-color: var(--sideBarBackground);
                    background: #fafafa;
                }

                svg {
                    font-size: 2.5rem;
                    color: var(--primary-color);
                }

                span {
                    font-size: 1rem;
                    color: var(--text-light);
                    font-weight: 600;
                    text-align: center;

                    &.format-info {
                        font-size: 0.8rem;
                        font-weight: 400;
                        color: var(--text-light);
                    }
                }
            }

            .logo-preview-container {
                display: flex;
                flex-direction: column;
                gap: 1rem;

                .logo-preview-box {
                    width: 100%;
                    min-height: 150px;
                    border: 2px solid var(--primary-color);
                    border-radius: 0.7rem;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 1rem;
                    background: var(--white-background);
                    overflow: hidden;

                    img {
                        max-width: 100%;
                        max-height: 200px;
                        object-fit: contain;
                    }
                }

                .logo-actions {
                    display: flex;
                    gap: 0.5rem;
                    justify-content: center;

                    button {
                        flex: 1;
                        max-width: 150px;
                        padding: 0.6rem 1rem;
                        border: none;
                        border-radius: 0.5rem;
                        font-size: 0.9rem;
                        font-weight: 600;
                        cursor: pointer;
                        transition: all 0.2s;
                        margin-top: 0;

                        &.btn-change {
                            background: var(--blue);
                            color: var(--text-white);

                            &:hover {
                                filter: brightness(0.9);
                                transform: translateY(-1px);
                            }
                        }

                        &.btn-remove {
                            background: var(--red);
                            color: var(--text-white);

                            &:hover {
                                filter: brightness(0.9);
                                transform: translateY(-1px);
                            }
                        }
                    }
                }
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
            margin-top: 1rem;
            background: var(--sideBarBackground);
            color: #ffffffff;
            font-size: 1.3rem;
            font-weight: 600;
            border: none;
            cursor: pointer;
            transition: all 0.2s;

            &:hover {
                background: #f5b1c1;
                color: #ffffffff;
                transform: scale(1.02);
                box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.25);
            }
        }
    }

    a {
        color: var(--sideBarBackground);
        margin-top: 1rem;
        font-size: 0.95rem;
        text-decoration: none;

        &:hover {
            text-decoration: underline;
        }
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
        max-height: none;

        form {
            padding: 0 1.5rem;

            h3 {
                margin-bottom: 1.5rem;
            }

            .form-input {
                margin-bottom: 1.2rem;
            }
        }
    }
`;

export const RegistrationImage = styled.div`
    display: flex;
    
    img {
        width: 700px;
        height: 773px;
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
`;
