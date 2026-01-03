import { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { Container, RegistrationForm, RegistrationImage } from "./style";
import { ErrorMessage } from "../../styles/global";
import { Loader } from "../../components/Loader";
import { useNavigate } from "react-router-dom";
import { createStore, uploadStoreLogo } from "../../services/storeService";
import InputMask from "react-input-mask";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCloudArrowUp } from "@fortawesome/free-solid-svg-icons";

import RegistrationCover from '../../assets/images/login-image.jpeg';
import logo from '../../assets/images/logo.png';

interface IStoreRegistration {
    name: string;
    slug: string;
    cnpj?: string;
    phone_number: string;
    email: string;
}

export function StoreRegistration() {
    const navigate = useNavigate();
    const {
        register,
        handleSubmit,
        formState: { errors },
        setError,
    } = useForm<IStoreRegistration>();

    const [showLoader, setShowLoader] = useState(false);
    const [logoFile, setLogoFile] = useState<File | null>(null);
    const [logoPreview, setLogoPreview] = useState<string>("");
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            if (file.size > 2 * 1024 * 1024) {
                alert("A logo deve ter no máximo 2MB. Escolha outra imagem por favor.");
                return;
            }

            const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
            if (!validTypes.includes(file.type)) {
                alert("Formato inválido. Use JPEG, JPG, PNG ou WEBP.");
                return;
            }

            setLogoFile(file);
            
            const reader = new FileReader();
            reader.onloadend = () => {
                setLogoPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleRemoveImage = () => {
        setLogoPreview("");
        setLogoFile(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const handleRegistrationSubmit = async (data: IStoreRegistration) => {
        setShowLoader(true);

        try {
            const response = await createStore({
                ...data,
                is_active: true
            });

            if (response) {
                // Se houver logo para fazer upload
                if (logoFile && response.id) {
                    try {
                        await uploadStoreLogo(response.id, logoFile);
                    } catch (logoError) {
                        console.error("Erro ao fazer upload da logo:", logoError);
                        // Continua mesmo se o upload da logo falhar
                    }
                }
                
                alert("Loja cadastrada com sucesso! Aguarde a aprovação da administração.");
                navigate("/login");
            }
        } catch (error: any) {
            setShowLoader(false);
            
            if (error.response) {
                const { status, data } = error.response;
                
                if (status === 400) {
                    if (data.message.includes("slug")) {
                        setError("slug", {
                            type: "custom",
                            message: "Este identificador já está em uso",
                        });
                    } else if (data.message.includes("CNPJ")) {
                        setError("cnpj", {
                            type: "custom",
                            message: "Este CNPJ já está cadastrado",
                        });
                    } else {
                        setError("email", {
                            type: "custom",
                            message: "Verifique os dados informados",
                        });
                    }
                } else if (status === 500) {
                    setError("email", {
                        type: "custom",
                        message: "Erro no servidor. Tente novamente mais tarde",
                    });
                }
            } else {
                setError("email", {
                    type: "custom",
                    message: "Erro ao cadastrar loja. Tente novamente",
                });
            }
        }
        
        setShowLoader(false);
    };

    return (
        <Container>
            <Loader show={showLoader} />
            <RegistrationForm>
                <div className="welcome-header">
                    <img src={logo} alt="Logo" />
                </div>
                <form onSubmit={handleSubmit(handleRegistrationSubmit)}>
                    <h3>Cadastro de Loja</h3>
                    
                    <div className="form-row">
                        <div className="form-input">
                            <p>Nome da Loja: <span>*</span></p>
                            <input
                                type="text"
                                placeholder="Ex: Mirai Flores"
                                {...register("name", {
                                    required: "Nome da loja é obrigatório",
                                })}
                            />
                            {errors.name && <ErrorMessage>{errors.name.message}</ErrorMessage>}
                        </div>

                        <div className="form-input">
                            <p>Identificador (Slug): <span>*</span></p>
                            <input
                                type="text"
                                placeholder="Ex: miraiflores (sem espaços)"
                                {...register("slug", {
                                    required: "Identificador é obrigatório",
                                    pattern: {
                                        value: /^[a-z0-9-]+$/,
                                        message: "Use apenas letras minúsculas, números e hífens"
                                    }
                                })}
                            />
                            {errors.slug && <ErrorMessage>{errors.slug.message}</ErrorMessage>}
                        </div>
                    </div>

                    <div className="logo-upload-section">
                        <h4 className="section-title">Logo da Loja</h4>
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/jpeg,image/jpg,image/png,image/webp"
                            onChange={handleImageChange}
                            style={{ display: "none" }}
                        />

                        {logoPreview ? (
                            <div className="logo-preview-container">
                                <div className="logo-preview-box">
                                    <img src={logoPreview} alt="Preview da Logo" />
                                </div>
                                <div className="logo-actions">
                                    <button
                                        type="button"
                                        className="btn-change"
                                        onClick={() => fileInputRef.current?.click()}
                                    >
                                        Trocar Logo
                                    </button>
                                    <button
                                        type="button"
                                        className="btn-remove"
                                        onClick={handleRemoveImage}
                                    >
                                        Remover Logo
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div 
                                className="logo-upload-box"
                                onClick={() => fileInputRef.current?.click()}
                            >
                                <FontAwesomeIcon icon={faCloudArrowUp} />
                                <span>Clique para selecionar a logo</span>
                                <span className="format-info">JPEG, JPG, PNG, WEBP (máx. 2MB)</span>
                            </div>
                        )}
                    </div>

                    <div className="form-input full-width">
                        <p>CNPJ:</p>
                        <InputMask
                            mask="99.999.999/9999-99"
                            {...register("cnpj")}
                        >
                            {(inputProps: any) => (
                                <input
                                    {...inputProps}
                                    type="text"
                                    placeholder="00.000.000/0000-00"
                                />
                            )}
                        </InputMask>
                        {errors.cnpj && <ErrorMessage>{errors.cnpj.message}</ErrorMessage>}
                    </div>

                    <div className="form-row">
                        <div className="form-input">
                            <p>Telefone: <span>*</span></p>
                            <InputMask
                                mask="(99) 99999-9999"
                                {...register("phone_number", {
                                    required: "Telefone é obrigatório",
                                })}
                            >
                                {(inputProps: any) => (
                                    <input
                                        {...inputProps}
                                        type="text"
                                        placeholder="(00) 00000-0000"
                                    />
                                )}
                            </InputMask>
                            {errors.phone_number && <ErrorMessage>{errors.phone_number.message}</ErrorMessage>}
                        </div>

                        <div className="form-input">
                            <p>E-mail: <span>*</span></p>
                            <input
                                type="email"
                                placeholder="contato@suafloricultura.com.br"
                                {...register("email", {
                                    required: "E-mail é obrigatório",
                                    pattern: {
                                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                        message: "E-mail inválido"
                                    }
                                })}
                            />
                            {errors.email && <ErrorMessage>{errors.email.message}</ErrorMessage>}
                        </div>
                    </div>

                    <button type="submit">Cadastrar Loja</button>
                </form>
                
                <a href="/login">
                    Já tem uma conta? Faça login
                </a>
                
                <div className="empty">
                    <h1>vazia</h1>
                </div>
            </RegistrationForm>

            <RegistrationImage>
                <img src={RegistrationCover} alt="Imagem de Cadastro" />
            </RegistrationImage>
        </Container>
    );
}
