import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Container, ResetPasswordForm, ResetPasswordImage } from "./style";
import LoginCover from '../../assets/images/login-image.jpeg'
import logo from '../../assets/images/logo.png'
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Loader } from "../../components/Loader";
import { resetPassword } from "../../services/adminService";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

interface IResetPassword {
    new_password: string;
    confirm_password: string;
}

export function ResetPasswordPage() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const {
        register,
        handleSubmit,
        formState: { errors },
        setError,
        watch,
    } = useForm<IResetPassword>();

    const [showLoader, setShowLoader] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [token, setToken] = useState<string | null>(null);

    useEffect(() => {
        const tokenFromUrl = searchParams.get("token");
        if (!tokenFromUrl) {
            navigate("/");
        } else {
            setToken(tokenFromUrl);
        }
    }, [searchParams, navigate]);

    const handleResetPasswordSubmit = async ({ new_password, confirm_password }: IResetPassword) => {
        if (new_password !== confirm_password) {
            setError("confirm_password", {
                type: "custom",
                message: "As senhas não coincidem",
            });
            return;
        }

        if (!token) {
            return;
        }

        setShowLoader(true);
        try {
            await resetPassword(token, new_password);
            alert("Senha redefinida com sucesso! Você será redirecionado para o login.");
            navigate("/backoffice");
        } catch (error: any) {
            const { status, data } = error.response || {};
            if (status === 400) {
                if (data?.message?.includes("expired")) {
                    setError("new_password", {
                        type: "custom",
                        message: "Token expirado. Solicite um novo link.",
                    });
                } else {
                    setError("new_password", {
                        type: "custom",
                        message: "Token inválido ou expirado",
                    });
                }
            } else {
                setError("new_password", {
                    type: "custom",
                    message: "Ocorreu um erro, tente novamente mais tarde",
                });
            }
        } finally {
            setShowLoader(false);
        }
    };

    if (!token) {
        return null;
    }

    return (
        <Container>
            <Loader show={showLoader} />
            <ResetPasswordForm>
                <div className="welcome-header">
                    <img src={logo} alt="" />
                </div>

                <form action="" onSubmit={handleSubmit(handleResetPasswordSubmit)}>
                    <h3>Redefinir Senha</h3>
                    <p className="description">
                        Digite sua nova senha abaixo.
                    </p>

                    <div className="form-input">
                        <p>Nova Senha:</p>
                        <div className="password-container">
                            <input
                                type={showPassword ? "text" : "password"}
                                {...register("new_password", {
                                    required: "Senha é obrigatória",
                                    minLength: {
                                        value: 6,
                                        message: "A senha deve ter no mínimo 6 caracteres",
                                    },
                                })}
                            />
                            <FontAwesomeIcon
                                icon={showPassword ? faEye : faEyeSlash}
                                onClick={() => setShowPassword(!showPassword)}
                                className="eye-icon"
                            />
                        </div>
                        {errors.new_password && (
                            <span className="error">{errors.new_password.message}</span>
                        )}
                    </div>

                    <div className="form-input">
                        <p>Confirmar Senha:</p>
                        <div className="password-container">
                            <input
                                type={showConfirmPassword ? "text" : "password"}
                                {...register("confirm_password", {
                                    required: "Confirmação de senha é obrigatória",
                                    validate: (value) =>
                                        value === watch("new_password") || "As senhas não coincidem",
                                })}
                            />
                            <FontAwesomeIcon
                                icon={showConfirmPassword ? faEye : faEyeSlash}
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="eye-icon"
                            />
                        </div>
                        {errors.confirm_password && (
                            <span className="error">{errors.confirm_password.message}</span>
                        )}
                    </div>

                    <button type="submit">Redefinir Senha</button>
                </form>

                <Link to="/backoffice">
                    Voltar para o login
                </Link>

                <div className="empty">
                    <h1>vazia</h1>
                </div>
                <footer>
                    <svg viewBox="0 -20 700 110" width="100%" height="70" preserveAspectRatio="none">
                        <path transform="translate(0, -20)" d="M0,10 c80,-22 240,0 350,18 c90,17 260,7.5 350,-20 v50 h-700" fill="#e4bfc7" />
                        <path d="M0,10 c80,-8 230,-12 350,7 c80,13 260,17 350,-5 v100 h-700z" fill="#e4bfc7" />
                    </svg>
                </footer>
            </ResetPasswordForm>

            <ResetPasswordImage>
                <img src={LoginCover} alt="" />
            </ResetPasswordImage>
        </Container>
    );
}
