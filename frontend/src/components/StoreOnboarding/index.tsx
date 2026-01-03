import { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCloudArrowUp, faCheck } from "@fortawesome/free-solid-svg-icons";
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
import { uploadStoreBanner, updateStore } from "../../services/storeService";

interface IStoreOnboardingProps {
    storeId: string;
    storeName: string;
    onComplete: () => void;
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
    const fileInputRef = useRef<HTMLInputElement>(null);

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

    const handleRemoveBanner = () => {
        setBannerPreview("");
        setBannerFile(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
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

    const handleBannerSubmit = async () => {
        setShowLoader(true);
        try {
            // Upload do banner (opcional)
            if (bannerFile) {
                await uploadStoreBanner(storeId, bannerFile);
            }

            // Atualizar is_first_access para false
            await updateStore(storeId, { is_first_access: false });

            setIsCompleted(true);
        } catch (error: any) {
            alert("Erro ao finalizar configuração. Tente novamente.");
            console.error(error);
        } finally {
            setShowLoader(false);
        }
    };

    const handleSkipBanner = async () => {
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
                    <p>Vamos configurar sua loja em apenas 3 passos simples</p>
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
                        <span className="step-label">Banner</span>
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

                {/* STEP 3: Banner */}
                {currentStep === 3 && (
                    <>
                        <OnboardingBody>
                            <h3>Banner da Loja (Opcional)</h3>
                            <div className="info-box">
                                <p>Adicione um banner atraente para a página principal da sua loja. Este passo é opcional e pode ser feito depois.</p>
                            </div>

                            <div className="banner-upload-section">
                                <input
                                    ref={fileInputRef}
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
                                        <div className="banner-actions">
                                            <button
                                                type="button"
                                                className="btn-change"
                                                onClick={() => fileInputRef.current?.click()}
                                            >
                                                Trocar Banner
                                            </button>
                                            <button
                                                type="button"
                                                className="btn-remove"
                                                onClick={handleRemoveBanner}
                                            >
                                                Remover Banner
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <div 
                                        className="banner-upload-box"
                                        onClick={() => fileInputRef.current?.click()}
                                    >
                                        <FontAwesomeIcon icon={faCloudArrowUp} />
                                        <span>Clique para selecionar o banner</span>
                                        <span className="format-info">JPEG, JPG, PNG, WEBP (máx. 5MB)</span>
                                    </div>
                                )}
                            </div>
                        </OnboardingBody>

                        <OnboardingFooter>
                            <div>
                                <button type="button" className="btn-back" onClick={() => setCurrentStep(2)}>
                                    Voltar
                                </button>
                                <button type="button" className="btn-skip" onClick={handleSkipBanner}>
                                    Pular por enquanto
                                </button>
                            </div>
                            <button 
                                type="button" 
                                className="btn-next" 
                                onClick={handleBannerSubmit}
                                disabled={!bannerFile}
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
