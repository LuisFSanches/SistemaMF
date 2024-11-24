import { useContext } from "react";
import { useForm } from "react-hook-form";
import { Container, LoginForm, LoginImage } from "./style";

import LoginCover from '../../assets/images/login-image.jpeg'
import logo from '../../assets/images/logo.png'
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext";

interface ISignIn {
    username: string;
    password: string;
}

export function LoginPage(){

    const navigate = useNavigate();
    const { handleLogin } = useContext(AuthContext);
    const {
        register,
        handleSubmit,
        setError,
    } = useForm<ISignIn>();

    const handleLoginSubmit = async ({ username, password }: ISignIn) => {
        const response = await handleLogin(username, password);

        if (!response.data) {
            const { status } = response.response;
            if (status === 400) {
                return setError("password", {
                    type: "custom",
                    message: "Usuário ou senha inválidos",
                });
            }
            if (status === 500) {
                return setError("password", {
                    type: "custom",
                    message: "Ocorreu um erro, tente novamente mais tarde",
                });
            }
        }
        navigate("/dashboard");
    };

    return(
        <Container>
            <LoginForm>
                <div className="welcome-header">
                    <h1>Mirai Flores</h1>
                    <img src={logo} alt="" />
                </div>
                <form action="" onSubmit={handleSubmit(handleLoginSubmit)}>
                    <h2>Faça seu Login</h2>
                    <div className="form-input">
                        <p>Usuário:</p>
                        <input type="text"
                            {...register("username", {
                                required: "Usuário ou senha inválidos",
                            })}
                        />
                    </div>

                    <div className="form-input">
                        <p>Senha:</p>
                        <input type="password"
                            {...register("password", {
                                required: "Usuário ou senha inválidos",
                            })}
                        />
                    </div>

                    <button onClick={() => {}}>Entrar</button>
                </form>
                <Link to="">
                    Esqueceu sua senha?
                </Link>
                <div className="empty">
                    <h1>vazia</h1>
                </div>
                <footer>
                    <svg viewBox="0 -20 700 110" width="100%" height="70" preserveAspectRatio="none">
                        <path transform="translate(0, -20)" d="M0,10 c80,-22 240,0 350,18 c90,17 260,7.5 350,-20 v50 h-700" fill="#e4bfc7" />
                        <path d="M0,10 c80,-8 230,-12 350,7 c80,13 260,17 350,-5 v100 h-700z" fill="#e4bfc7" />
                    </svg>
                </footer >
            </LoginForm>

            <LoginImage>
                <img src={LoginCover} alt="" />
            </LoginImage>

            
        </Container>
    )
}