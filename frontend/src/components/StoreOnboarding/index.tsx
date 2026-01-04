import { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCloudArrowUp, faCheck, faUser, faImage } from "@fortawesome/free-solid-svg-icons";
import InputMask from "react-input-mask";
import {
    OnboardingOverlay,
    OnboardingContainer,
    OnboardingHeader,
    OnboardingProgress,
    ProgressStep,
    OnboardingBody,
    OnboardingFooter,
    SuccessMessage
} from "./style";
import { ErrorMessage } from "../../styles/global";
import { Loader } from "../Loader";
import { STATES } from "../../constants";
import { ICreateStoreAddress } from "../../interfaces/IStoreAddress";
import { ICreateStoreSchedule, DayOfWeek } from "../../interfaces/IStoreSchedule";
import { createStoreAddress } from "../../services/storeAddressService";
import { createStoreSchedule } from "../../services/storeScheduleService";
import { uploadStoreBanner, uploadStoreLogo, updateStore, updateStoreCredentials } from "../../services/storeService";

interface IStoreOnboardingProps {
    storeId: string;
    storeName: string;
    onComplete: () => void;
}

interface IPaymentCredentials {
    mp_access_token: string;
    mp_public_key: string;
    mp_seller_id: string;
    mp_webhook_secret: string;
    inter_client_id: string;
    inter_client_secret: string;
    inter_api_cert_path: string;
    inter_api_key_path: string;
}

interface ISocialMedia {
    facebook?: string;
    instagram?: string;
    youtube?: string;
}

const DAYS_OF_WEEK: { value: DayOfWeek; label: string }[] = [
    { value: 'MONDAY', label: 'Segunda-feira' },
    { value: 'TUESDAY', label: 'Terça-feira' },
    { value: 'WEDNESDAY', label: 'Quarta-feira' },
    { value: 'THURSDAY', label: 'Quinta-feira' },
    { value: 'FRIDAY', label: 'Sexta-feira' },
    { value: 'SATURDAY', label: 'Sábado' },
    { value: 'SUNDAY', label: 'Domingo' }
];

export function StoreOnboarding({ storeId, storeName, onComplete }: IStoreOnboardingProps) {
    const [currentStep, setCurrentStep] = useState(1);
    const [showLoader, setShowLoader] = useState(false);
    const [isCompleted, setIsCompleted] = useState(false);
    const [bannerFile, setBannerFile] = useState<File | null>(null);
    const [bannerPreview, setBannerPreview] = useState<string>("");
    const [avatarFile, setAvatarFile] = useState<File | null>(null);
    const [avatarPreview, setAvatarPreview] = useState<string>("");
    const bannerInputRef = useRef<HTMLInputElement>(null);
    const avatarInputRef = useRef<HTMLInputElement>(null);

    // Estados para meios de pagamento
    const [noMercadoPago, setNoMercadoPago] = useState(false);
    const [noInterBank, setNoInterBank] = useState(false);
    const [paymentCredentials, setPaymentCredentials] = useState<IPaymentCredentials>({
        mp_access_token: '',
        mp_public_key: '',
        mp_seller_id: '',
        mp_webhook_secret: '',
        inter_client_id: '',
        inter_client_secret: '',
        inter_api_cert_path: '',
        inter_api_key_path: ''
    });

    // Estados para redes sociais
    const [socialMedia, setSocialMedia] = useState<ISocialMedia>({
        facebook: '',
        instagram: '',
        youtube: ''
    });

    // Formulário de endereço
    const {
        register: registerAddress,
        handleSubmit: handleSubmitAddress,
        formState: { errors: errorsAddress },
    } = useForm<ICreateStoreAddress>();

    // Estado para horários
    const [schedules, setSchedules] = useState<Record<DayOfWeek, ICreateStoreSchedule>>({
        MONDAY: { store_id: storeId, day_of_week: 'MONDAY', is_closed: false, opening_time: '08:00', closing_time: '18:00' },
        TUESDAY: { store_id: storeId, day_of_week: 'TUESDAY', is_closed: false, opening_time: '08:00', closing_time: '18:00' },
        WEDNESDAY: { store_id: storeId, day_of_week: 'WEDNESDAY', is_closed: false, opening_time: '08:00', closing_time: '18:00' },
        THURSDAY: { store_id: storeId, day_of_week: 'THURSDAY', is_closed: false, opening_time: '08:00', closing_time: '18:00' },
        FRIDAY: { store_id: storeId, day_of_week: 'FRIDAY', is_closed: false, opening_time: '08:00', closing_time: '18:00' },
        SATURDAY: { store_id: storeId, day_of_week: 'SATURDAY', is_closed: false, opening_time: '08:00', closing_time: '14:00' },
        SUNDAY: { store_id: storeId, day_of_week: 'SUNDAY', is_closed: true }
    });

    const handleBannerChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                alert("O banner deve ter no máximo 5MB. Escolha outra imagem por favor.");
                return;
            }

            const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
            if (!validTypes.includes(file.type)) {
                alert("Formato inválido. Use JPEG, JPG, PNG ou WEBP.");
                return;
            }

            setBannerFile(file);
            
            const reader = new FileReader();
            reader.onloadend = () => {
                setBannerPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            if (file.size > 2 * 1024 * 1024) {
                alert("O avatar deve ter no máximo 2MB. Escolha outra imagem por favor.");
                return;
            }

            const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
            if (!validTypes.includes(file.type)) {
                alert("Formato inválido. Use JPEG, JPG, PNG ou WEBP.");
                return;
            }

            setAvatarFile(file);
            
            const reader = new FileReader();
            reader.onloadend = () => {
                setAvatarPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleRemoveBanner = () => {
        setBannerPreview("");
        setBannerFile(null);
        if (bannerInputRef.current) {
            bannerInputRef.current.value = "";
        }
    };

    const handleRemoveAvatar = () => {
        setAvatarPreview("");
        setAvatarFile(null);
        if (avatarInputRef.current) {
            avatarInputRef.current.value = "";
        }
    };

    const handlePaymentCredentialChange = (field: keyof IPaymentCredentials, value: string) => {
        setPaymentCredentials(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleSocialMediaChange = (field: keyof ISocialMedia, value: string) => {
        setSocialMedia(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleScheduleChange = (day: DayOfWeek, field: keyof ICreateStoreSchedule, value: any) => {
        setSchedules(prev => ({
            ...prev,
            [day]: {
                ...prev[day],
                [field]: value
            }
        }));
    };

    const handleAddressSubmit = async (data: ICreateStoreAddress) => {
        setShowLoader(true);
        try {
            await createStoreAddress({
                ...data,
                store_id: storeId,
                country: data.country || 'Brasil',
                is_main: true
            });
            setCurrentStep(2);
        } catch (error: any) {
            alert("Erro ao salvar endereço. Tente novamente.");
            console.error(error);
        } finally {
            setShowLoader(false);
        }
    };

    const handleSchedulesSubmit = async () => {
        setShowLoader(true);
        try {
            // Criar horários para todos os dias
            for (const schedule of Object.values(schedules)) {
                await createStoreSchedule(schedule);
            }
            setCurrentStep(3);
        } catch (error: any) {
            alert("Erro ao salvar horários. Tente novamente.");
            console.error(error);
        } finally {
            setShowLoader(false);
        }
    };

    const handleMediaSubmit = async () => {
        setShowLoader(true);
        try {
            // Upload do avatar (opcional)
            if (avatarFile) {
                await uploadStoreLogo(storeId, avatarFile);
            }

            // Upload do banner (opcional)
            if (bannerFile) {
                await uploadStoreBanner(storeId, bannerFile);
            }

            setCurrentStep(4);
        } catch (error: any) {
            alert("Erro ao salvar mídia. Tente novamente.");
            console.error(error);
        } finally {
            setShowLoader(false);
        }
    };

    const handleSkipMedia = () => {
        setCurrentStep(4);
    };

    const handlePaymentSubmit = async () => {
        setShowLoader(true);
        try {
            // Preparar dados de credenciais
            const credentialsData: any = {};

            if (!noMercadoPago) {
                if (paymentCredentials.mp_access_token) credentialsData.mp_access_token = paymentCredentials.mp_access_token;
                if (paymentCredentials.mp_public_key) credentialsData.mp_public_key = paymentCredentials.mp_public_key;
                if (paymentCredentials.mp_seller_id) credentialsData.mp_seller_id = paymentCredentials.mp_seller_id;
                if (paymentCredentials.mp_webhook_secret) credentialsData.mp_webhook_secret = paymentCredentials.mp_webhook_secret;
            }

            if (!noInterBank) {
                if (paymentCredentials.inter_client_id) credentialsData.inter_client_id = paymentCredentials.inter_client_id;
                if (paymentCredentials.inter_client_secret) credentialsData.inter_client_secret = paymentCredentials.inter_client_secret;
                if (paymentCredentials.inter_api_cert_path) credentialsData.inter_api_cert_path = paymentCredentials.inter_api_cert_path;
                if (paymentCredentials.inter_api_key_path) credentialsData.inter_api_key_path = paymentCredentials.inter_api_key_path;
            }

            // Salvar credenciais se houver alguma
            if (Object.keys(credentialsData).length > 0) {
                await updateStoreCredentials(storeId, credentialsData);
            }

            setCurrentStep(5);
        } catch (error: any) {
            alert("Erro ao salvar configurações de pagamento. Tente novamente.");
            console.error(error);
        } finally {
            setShowLoader(false);
        }
    };

    const handleSkipPayment = () => {
        setCurrentStep(5);
    };

    const handleSocialSubmit = async () => {
        setShowLoader(true);
        try {
            // Preparar dados de redes sociais
            const socialData: any = {};
            if (socialMedia.facebook) socialData.facebook = socialMedia.facebook;
            if (socialMedia.instagram) socialData.instagram = socialMedia.instagram;
            if (socialMedia.youtube) socialData.youtube = socialMedia.youtube;

            // Salvar redes sociais se houver alguma
            if (Object.keys(socialData).length > 0) {
                await updateStore(storeId, socialData);
            }

            // Atualizar is_first_access para false
            await updateStore(storeId, { is_first_access: false });

            setIsCompleted(true);
        } catch (error: any) {
            alert("Erro ao salvar redes sociais. Tente novamente.");
            console.error(error);
        } finally {
            setShowLoader(false);
        }
    };

    const handleSkipSocial = async () => {
        setShowLoader(true);
        try {
            // Apenas atualizar is_first_access para false
            await updateStore(storeId, { is_first_access: false });
            setIsCompleted(true);
        } catch (error: any) {
            alert("Erro ao finalizar configuração. Tente novamente.");
            console.error(error);
        } finally {
            setShowLoader(false);
        }
    };

    if (isCompleted) {
        return (
            <OnboardingOverlay>
                <OnboardingContainer>
                    <OnboardingBody>
                        <SuccessMessage>
                            <FontAwesomeIcon icon={faCheck} />
                            <h3>Configuração Concluída!</h3>
                            <p>
                                Parabéns! Sua loja <strong>{storeName}</strong> está configurada e pronta para uso.
                                <br />
                                Agora você pode começar a gerenciar seus pedidos, produtos e clientes.
                            </p>
                            <button onClick={onComplete}>
                                Começar a Usar
                            </button>
                        </SuccessMessage>
                    </OnboardingBody>
                </OnboardingContainer>
            </OnboardingOverlay>
        );
    }

    return (
        <OnboardingOverlay>
            <Loader show={showLoader} />
            <OnboardingContainer>
                <OnboardingHeader>
                    <h2>Bem-vindo, {storeName}!</h2>
                    <p>Vamos configurar sua loja em apenas alguns passos simples</p>
                </OnboardingHeader>

                <OnboardingProgress>
                    <ProgressStep active={currentStep === 1} completed={currentStep > 1}>
                        <div className="step-number">1</div>
                        <span className="step-label">Endereço</span>
                    </ProgressStep>
                    <ProgressStep active={currentStep === 2} completed={currentStep > 2}>
                        <div className="step-number">2</div>
                        <span className="step-label">Horários</span>
                    </ProgressStep>
                    <ProgressStep active={currentStep === 3} completed={currentStep > 3}>
                        <div className="step-number">3</div>
                        <span className="step-label">Mídia</span>
                    </ProgressStep>
                    <ProgressStep active={currentStep === 4} completed={currentStep > 4}>
                        <div className="step-number">4</div>
                        <span className="step-label">Pagamento</span>
                    </ProgressStep>
                    <ProgressStep active={currentStep === 5} completed={currentStep > 5}>
                        <div className="step-number">5</div>
                        <span className="step-label">Redes Sociais</span>
                    </ProgressStep>
                </OnboardingProgress>

                {/* STEP 1: Endereço */}
                {currentStep === 1 && (
                    <form onSubmit={handleSubmitAddress(handleAddressSubmit)}>
                        <OnboardingBody>
                            <h3>Endereço da Loja</h3>
                            <div className="info-box">
                                <p>Este será o endereço principal da sua loja, usado para entregas e exibição no site.</p>
                            </div>

                            <div className="form-row">
                                <div className="form-input">
                                    <p>CEP:</p>
                                    <InputMask
                                        mask="99999-999"
                                        {...registerAddress("postal_code")}
                                    >
                                        {(inputProps: any) => (
                                            <input
                                                {...inputProps}
                                                type="text"
                                                placeholder="00000-000"
                                            />
                                        )}
                                    </InputMask>
                                </div>

                                <div className="form-input">
                                    <p>Estado (UF): <span>*</span></p>
                                    <select {...registerAddress("state", { required: "Estado é obrigatório" })}>
                                        <option value="">Selecione...</option>
                                        {Object.entries(STATES).map(([uf, name]) => (
                                            <option key={uf} value={uf}>
                                                {uf} - {name}
                                            </option>
                                        ))}
                                    </select>
                                    {errorsAddress.state && <ErrorMessage>{errorsAddress.state.message}</ErrorMessage>}
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="form-input">
                                    <p>Cidade: <span>*</span></p>
                                    <input
                                        type="text"
                                        placeholder="São Paulo"
                                        {...registerAddress("city", { required: "Cidade é obrigatória" })}
                                    />
                                    {errorsAddress.city && <ErrorMessage>{errorsAddress.city.message}</ErrorMessage>}
                                </div>

                                <div className="form-input">
                                    <p>Bairro: <span>*</span></p>
                                    <input
                                        type="text"
                                        placeholder="Centro"
                                        {...registerAddress("neighborhood", { required: "Bairro é obrigatório" })}
                                    />
                                    {errorsAddress.neighborhood && <ErrorMessage>{errorsAddress.neighborhood.message}</ErrorMessage>}
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="form-input">
                                    <p>Rua: <span>*</span></p>
                                    <input
                                        type="text"
                                        placeholder="Rua das Flores"
                                        {...registerAddress("street", { required: "Rua é obrigatória" })}
                                    />
                                    {errorsAddress.street && <ErrorMessage>{errorsAddress.street.message}</ErrorMessage>}
                                </div>

                                <div className="form-input">
                                    <p>Número: <span>*</span></p>
                                    <input
                                        type="text"
                                        placeholder="123"
                                        {...registerAddress("street_number", { required: "Número é obrigatório" })}
                                    />
                                    {errorsAddress.street_number && <ErrorMessage>{errorsAddress.street_number.message}</ErrorMessage>}
                                </div>
                            </div>

                            <div className="form-row single-column">
                                <div className="form-input">
                                    <p>Complemento:</p>
                                    <input
                                        type="text"
                                        placeholder="Loja 1, Sala 205"
                                        {...registerAddress("complement")}
                                    />
                                </div>
                            </div>

                            <div className="form-row single-column">
                                <div className="form-input">
                                    <p>Ponto de Referência:</p>
                                    <input
                                        type="text"
                                        placeholder="Próximo ao mercado central"
                                        {...registerAddress("reference_point")}
                                    />
                                </div>
                            </div>
                        </OnboardingBody>

                        <OnboardingFooter>
                            <button type="button" className="btn-back" disabled>
                                Voltar
                            </button>
                            <button type="submit" className="btn-next">
                                Próximo
                            </button>
                        </OnboardingFooter>
                    </form>
                )}

                {/* STEP 2: Horários */}
                {currentStep === 2 && (
                    <>
                        <OnboardingBody>
                            <h3>Horários de Funcionamento</h3>
                            <div className="info-box">
                                <p>Defina os horários em que sua loja estará disponível para receber pedidos.</p>
                            </div>

                            {DAYS_OF_WEEK.map(({ value, label }) => (
                                <div key={value} className="schedule-card">
                                    <div className="day-header">
                                        <h4>{label}</h4>
                                        <div className="checkbox-group">
                                            <input
                                                type="checkbox"
                                                id={`closed-${value}`}
                                                checked={schedules[value].is_closed}
                                                onChange={(e) => handleScheduleChange(value, 'is_closed', e.target.checked)}
                                            />
                                            <label htmlFor={`closed-${value}`}>Fechado</label>
                                        </div>
                                    </div>

                                    {!schedules[value].is_closed && (
                                        <div className="form-row">
                                            <div className="form-input">
                                                <p>Abertura:</p>
                                                <input
                                                    type="time"
                                                    value={schedules[value].opening_time || ''}
                                                    onChange={(e) => handleScheduleChange(value, 'opening_time', e.target.value)}
                                                />
                                            </div>
                                            <div className="form-input">
                                                <p>Fechamento:</p>
                                                <input
                                                    type="time"
                                                    value={schedules[value].closing_time || ''}
                                                    onChange={(e) => handleScheduleChange(value, 'closing_time', e.target.value)}
                                                />
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </OnboardingBody>

                        <OnboardingFooter>
                            <button type="button" className="btn-back" onClick={() => setCurrentStep(1)}>
                                Voltar
                            </button>
                            <button type="button" className="btn-next" onClick={handleSchedulesSubmit}>
                                Próximo
                            </button>
                        </OnboardingFooter>
                    </>
                )}

                {/* STEP 3: Mídia */}
                {currentStep === 3 && (
                    <>
                        <OnboardingBody>
                            <h3>Mídia da Loja (Opcional)</h3>
                            <div className="info-box">
                                <p>Adicione um avatar e um banner atraentes para personalizar sua loja. Este passo é opcional e pode ser feito depois.</p>
                            </div>

                            <div className="media-upload-grid">
                                {/* Avatar Upload */}
                                <div className="media-upload-section">
                                    <h4><FontAwesomeIcon icon={faUser} /> Avatar / Logo</h4>
                                    <p className="media-description">Imagem quadrada que representa sua loja</p>
                                    
                                    <input
                                        ref={avatarInputRef}
                                        type="file"
                                        accept="image/jpeg,image/jpg,image/png,image/webp"
                                        onChange={handleAvatarChange}
                                        style={{ display: "none" }}
                                    />

                                    {avatarPreview ? (
                                        <div className="avatar-preview-container">
                                            <div className="avatar-preview-box">
                                                <img src={avatarPreview} alt="Preview do Avatar" />
                                            </div>
                                            <div className="media-actions">
                                                <button
                                                    type="button"
                                                    className="btn-change"
                                                    onClick={() => avatarInputRef.current?.click()}
                                                >
                                                    Trocar
                                                </button>
                                                <button
                                                    type="button"
                                                    className="btn-remove"
                                                    onClick={handleRemoveAvatar}
                                                >
                                                    Remover
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div 
                                            className="media-upload-box avatar-upload"
                                            onClick={() => avatarInputRef.current?.click()}
                                        >
                                            <FontAwesomeIcon icon={faUser} />
                                            <span>Clique para selecionar</span>
                                            <span className="format-info">JPEG, PNG, WEBP (máx. 2MB)</span>
                                        </div>
                                    )}
                                </div>

                                {/* Banner Upload */}
                                <div className="media-upload-section">
                                    <h4><FontAwesomeIcon icon={faImage} /> Banner</h4>
                                    <p className="media-description">Imagem horizontal para o topo da loja</p>
                                    
                                    <input
                                        ref={bannerInputRef}
                                        type="file"
                                        accept="image/jpeg,image/jpg,image/png,image/webp"
                                        onChange={handleBannerChange}
                                        style={{ display: "none" }}
                                    />

                                    {bannerPreview ? (
                                        <div className="banner-preview-container">
                                            <div className="banner-preview-box">
                                                <img src={bannerPreview} alt="Preview do Banner" />
                                            </div>
                                            <div className="media-actions">
                                                <button
                                                    type="button"
                                                    className="btn-change"
                                                    onClick={() => bannerInputRef.current?.click()}
                                                >
                                                    Trocar
                                                </button>
                                                <button
                                                    type="button"
                                                    className="btn-remove"
                                                    onClick={handleRemoveBanner}
                                                >
                                                    Remover
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div 
                                            className="media-upload-box banner-upload"
                                            onClick={() => bannerInputRef.current?.click()}
                                        >
                                            <FontAwesomeIcon icon={faCloudArrowUp} />
                                            <span>Clique para selecionar</span>
                                            <span className="format-info">JPEG, PNG, WEBP (máx. 5MB)</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </OnboardingBody>

                        <OnboardingFooter>
                            <div>
                                <button type="button" className="btn-back" onClick={() => setCurrentStep(2)}>
                                    Voltar
                                </button>
                                <button type="button" className="btn-skip" onClick={handleSkipMedia}>
                                    Pular por enquanto
                                </button>
                            </div>
                            <button 
                                type="button" 
                                className="btn-next" 
                                onClick={handleMediaSubmit}
                                disabled={!bannerFile && !avatarFile}
                            >
                                Próximo
                            </button>
                        </OnboardingFooter>
                    </>
                )}

                {/* STEP 4: Meios de Pagamento */}
                {currentStep === 4 && (
                    <>
                        <OnboardingBody>
                            <h3>Meios de Pagamento (Opcional)</h3>
                            <div className="info-box">
                                <p>Configure suas integrações de pagamento para receber pagamentos online. Você pode pular esta etapa e configurar depois.</p>
                            </div>

                            {/* Mercado Pago Section */}
                            <div className="payment-section">
                                <div className="payment-header">
                                    <h4>Mercado Pago</h4>
                                    <div className="checkbox-group">
                                        <input
                                            type="checkbox"
                                            id="no-mercadopago"
                                            checked={noMercadoPago}
                                            onChange={(e) => setNoMercadoPago(e.target.checked)}
                                        />
                                        <label htmlFor="no-mercadopago">Não tenho conta no Mercado Pago</label>
                                    </div>
                                </div>

                                {!noMercadoPago && (
                                    <div className="payment-fields">
                                        <div className="form-input">
                                            <p>Access Token:</p>
                                            <textarea
                                                placeholder="APP_USR-0000000000000000-000000-00000000000000000000000000000000-000000000"
                                                value={paymentCredentials.mp_access_token}
                                                onChange={(e) => handlePaymentCredentialChange('mp_access_token', e.target.value)}
                                                rows={2}
                                            />
                                        </div>
                                        <div className="form-input">
                                            <p>Public Key:</p>
                                            <textarea
                                                placeholder="APP_USR-00000000-0000-0000-0000-000000000000"
                                                value={paymentCredentials.mp_public_key}
                                                onChange={(e) => handlePaymentCredentialChange('mp_public_key', e.target.value)}
                                                rows={2}
                                            />
                                        </div>
                                        <div className="form-row">
                                            <div className="form-input">
                                                <p>Seller ID:</p>
                                                <input
                                                    type="text"
                                                    placeholder="000000000"
                                                    value={paymentCredentials.mp_seller_id}
                                                    onChange={(e) => handlePaymentCredentialChange('mp_seller_id', e.target.value)}
                                                />
                                            </div>
                                            <div className="form-input">
                                                <p>Webhook Secret:</p>
                                                <input
                                                    type="text"
                                                    placeholder="Chave secreta do webhook"
                                                    value={paymentCredentials.mp_webhook_secret}
                                                    onChange={(e) => handlePaymentCredentialChange('mp_webhook_secret', e.target.value)}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Banco Inter Section */}
                            <div className="payment-section">
                                <div className="payment-header">
                                    <h4>Banco Inter</h4>
                                    <div className="checkbox-group">
                                        <input
                                            type="checkbox"
                                            id="no-inter"
                                            checked={noInterBank}
                                            onChange={(e) => setNoInterBank(e.target.checked)}
                                        />
                                        <label htmlFor="no-inter">Não tenho conta no Banco Inter</label>
                                    </div>
                                </div>

                                {!noInterBank && (
                                    <div className="payment-fields">
                                        <div className="form-row">
                                            <div className="form-input">
                                                <p>Client ID:</p>
                                                <input
                                                    type="text"
                                                    placeholder="ID do cliente da API"
                                                    value={paymentCredentials.inter_client_id}
                                                    onChange={(e) => handlePaymentCredentialChange('inter_client_id', e.target.value)}
                                                />
                                            </div>
                                            <div className="form-input">
                                                <p>Client Secret:</p>
                                                <input
                                                    type="text"
                                                    placeholder="Chave secreta do cliente"
                                                    value={paymentCredentials.inter_client_secret}
                                                    onChange={(e) => handlePaymentCredentialChange('inter_client_secret', e.target.value)}
                                                />
                                            </div>
                                        </div>
                                        <div className="form-input">
                                            <p>Certificado da API (conteúdo .crt):</p>
                                            <textarea
                                                placeholder="-----BEGIN CERTIFICATE-----&#10;...&#10;-----END CERTIFICATE-----"
                                                value={paymentCredentials.inter_api_cert_path}
                                                onChange={(e) => handlePaymentCredentialChange('inter_api_cert_path', e.target.value)}
                                                rows={4}
                                            />
                                        </div>
                                        <div className="form-input">
                                            <p>Chave da API (conteúdo .key):</p>
                                            <textarea
                                                placeholder="-----BEGIN RSA PRIVATE KEY-----&#10;...&#10;-----END RSA PRIVATE KEY-----"
                                                value={paymentCredentials.inter_api_key_path}
                                                onChange={(e) => handlePaymentCredentialChange('inter_api_key_path', e.target.value)}
                                                rows={4}
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>
                        </OnboardingBody>

                        <OnboardingFooter>
                            <div>
                                <button type="button" className="btn-back" onClick={() => setCurrentStep(3)}>
                                    Voltar
                                </button>
                                <button type="button" className="btn-skip" onClick={handleSkipPayment}>
                                    Pular por enquanto
                                </button>
                            </div>
                            <button 
                                type="button" 
                                className="btn-next" 
                                onClick={handlePaymentSubmit}
                            >
                                Próximo
                            </button>
                        </OnboardingFooter>
                    </>
                )}

                {/* STEP 5: Redes Sociais */}
                {currentStep === 5 && (
                    <>
                        <OnboardingBody>
                            <h3>Redes Sociais (Opcional)</h3>
                            <div className="info-box">
                                <p>Conecte suas redes sociais para que seus clientes possam encontrar e seguir sua loja. Este passo é opcional e pode ser configurado depois.</p>
                            </div>

                            <div className="form-input">
                                <label>
                                    <FontAwesomeIcon icon={faUser} /> Facebook
                                </label>
                                <input
                                    type="url"
                                    placeholder="https://facebook.com/sua-pagina"
                                    value={socialMedia.facebook}
                                    onChange={(e) => handleSocialMediaChange('facebook', e.target.value)}
                                />
                                <small>Cole o link completo do seu perfil ou página no Facebook</small>
                            </div>

                            <div className="form-input">
                                <label>
                                    <FontAwesomeIcon icon={faUser} /> Instagram
                                </label>
                                <input
                                    type="url"
                                    placeholder="https://instagram.com/seu-perfil"
                                    value={socialMedia.instagram}
                                    onChange={(e) => handleSocialMediaChange('instagram', e.target.value)}
                                />
                                <small>Cole o link completo do seu perfil no Instagram</small>
                            </div>

                            <div className="form-input">
                                <label>
                                    <FontAwesomeIcon icon={faUser} /> YouTube
                                </label>
                                <input
                                    type="url"
                                    placeholder="https://youtube.com/@seu-canal"
                                    value={socialMedia.youtube}
                                    onChange={(e) => handleSocialMediaChange('youtube', e.target.value)}
                                />
                                <small>Cole o link completo do seu canal no YouTube</small>
                            </div>
                        </OnboardingBody>

                        <OnboardingFooter>
                            <div>
                                <button type="button" className="btn-back" onClick={() => setCurrentStep(4)}>
                                    Voltar
                                </button>
                                <button type="button" className="btn-skip" onClick={handleSkipSocial}>
                                    Pular por enquanto
                                </button>
                            </div>
                            <button 
                                type="button" 
                                className="btn-next" 
                                onClick={handleSocialSubmit}
                            >
                                Finalizar
                            </button>
                        </OnboardingFooter>
                    </>
                )}
            </OnboardingContainer>
        </OnboardingOverlay>
    );
}
