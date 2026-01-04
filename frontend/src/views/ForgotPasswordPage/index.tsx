import { useState } from "react";
import { useForm } from "react-hook-form";
import { Container, ForgotPasswordForm, ForgotPasswordImage } from "./style";
import LoginCover from '../../assets/images/login-image.jpeg'
import logo from '../../assets/images/logo.png'
import { Link } from "react-router-dom";
import { Loader } from "../../components/Loader";
import { requestPasswordReset } from "../../services/adminService";

interface IForgotPassword {
    email: string;
}

export function ForgotPasswordPage() {
    const {
        register,
        handleSubmit,
        formState: { errors },
        setError,
    } = useForm<IForgotPassword>();

    const [showLoader, setShowLoader] = useState(false);
    const [successMessage, setSuccessMessage] = useState(false);

    const handleForgotPasswordSubmit = async ({ email }: IForgotPassword) => {
        setShowLoader(true);
        try {
            await requestPasswordReset(email);
            setSuccessMessage(true);
        } catch (error: any) {
            const { status } = error.response || {};
            if (status === 400) {
                setError("email", {
                    type: "custom",
                    message: "Email inválido",
                });
            } else {
                setError("email", {
                    type: "custom",
                    message: "Ocorreu um erro, tente novamente mais tarde",
                });
            }
        } finally {
            setShowLoader(false);
        }
    };

    return (
        <Container>
            <Loader show={showLoader} />
            <ForgotPasswordForm>
                <div className="welcome-header">
                    <img src={logo} alt="" />
                </div>

                {!successMessage ? (
                    <>
                        <form action="" onSubmit={handleSubmit(handleForgotPasswordSubmit)}>
                            <h3>Recuperar Senha</h3>
                            <p className="description">
                                Digite seu email e enviaremos um link para redefinir sua senha.
                            </p>
                            <div className="form-input">
                                <p>Email:</p>
                                <input
                                    type="email"
                                    {...register("email", {
                                        required: "Email é obrigatório",
                                    })}
                                />
                                {errors.email && (
                                    <span className="error">{errors.email.message}</span>
                                )}
                            </div>

                            <button type="submit">Enviar Link</button>
                        </form>
                        <Link to="/backoffice">
                            Voltar para o login
                        </Link>
                    </>
                ) : (
                    <div className="success-container">
                        <h3>Email enviado!</h3>
                        <p className="success-message">
                            Se o email estiver cadastrado, você receberá um link para redefinir sua senha.
                            Verifique sua caixa de entrada e spam.
                        </p>
                        <Link to="/backoffice" className="back-link">
                            Voltar para o login
                        </Link>
                    </div>
                )}

                <div className="empty">
                    <h1>vazia</h1>
                </div>
                <footer>
                    <svg viewBox="0 -20 700 110" width="100%" height="70" preserveAspectRatio="none">
                        <path transform="translate(0, -20)" d="M0,10 c80,-22 240,0 350,18 c90,17 260,7.5 350,-20 v50 h-700" fill="#e4bfc7" />
                        <path d="M0,10 c80,-8 230,-12 350,7 c80,13 260,17 350,-5 v100 h-700z" fill="#e4bfc7" />
                    </svg>
                </footer>
            </ForgotPasswordForm>

            <ForgotPasswordImage>
                <img src={LoginCover} alt="" />
            </ForgotPasswordImage>
        </Container>
    );
}
