import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import Modal from 'react-modal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCog, faImage, faLock, faMapMarkerAlt, faCreditCard, faClock, faStore, faEye, faEyeSlash, faXmark, faShareNodes, faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { Label, Input, Select, ErrorMessage, Checkbox, CheckboxContainer, FormField, Textarea, PasswordContainer, ModalContainer, Form } from '../../styles/global';
import { 
    Container, 
    Header, 
    TabsContainer, 
    Tab, 
    TabContent,
    MediaSection,
    ImageUploadArea,
    ImagePreview,
    AvatarPreview,
    BannerPreview,
    FileInputLabel,
    ScheduleGrid,
    DayScheduleCard,
    ScheduleInputsRow,
    TimeInputGroup,
    PaymentMethodCard,
    FormGrid,
    ButtonGroup,
    SaveButton,
    CancelButton,
    LoadingContainer
} from './style';
import { getStoreById, updateStore, uploadStoreLogo, uploadStoreBanner, uploadStoreBanner2, uploadStoreBanner3, updateStoreSchedules } from '../../services/storeService';
import { getStoreAddresses, updateStoreAddress, createStoreAddress } from '../../services/storeAddressService';
import { getStoreSchedules } from '../../services/storeScheduleService';
import { resetPasswordByEmail } from '../../services/adminService';
import { IStore } from '../../interfaces/IStore';
import { IStoreAddress } from '../../interfaces/IStoreAddress';
import { IStoreSchedule, DayOfWeek } from '../../interfaces/IStoreSchedule';
import { STATES } from '../../constants';

type TabType = 'general' | 'media' | 'password' | 'address' | 'payment' | 'schedule' | 'social';

interface GeneralFormData {
    cnpj?: string;
    slug: string;
    phone_number: string;
    description?: string;
}

interface PasswordFormData {
    new_password: string;
    confirm_password: string;
}

interface SocialFormData {
    facebook?: string;
    instagram?: string;
    youtube?: string;
}

interface AddressFormData {
    street: string;
    street_number: string;
    complement?: string;
    neighborhood: string;
    reference_point?: string;
    city: string;
    state: string;
    postal_code?: string;
    country: string;
}

interface PaymentFormData {
    mp_access_token?: string;
    mp_public_key?: string;
    mp_seller_id?: string;
    mp_webhook_secret?: string;
    inter_client_id?: string;
    inter_client_secret?: string;
    inter_api_cert_path?: string;
    inter_api_key_path?: string;
    payment_enabled: boolean;
}

const DAY_LABELS: Record<DayOfWeek, string> = {
    MONDAY: 'Segunda-feira',
    TUESDAY: 'Terça-feira',
    WEDNESDAY: 'Quarta-feira',
    THURSDAY: 'Quinta-feira',
    FRIDAY: 'Sexta-feira',
    SATURDAY: 'Sábado',
    SUNDAY: 'Domingo'
};

const DAYS_ORDER: DayOfWeek[] = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'];

export default function StoreSettings() {
    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<TabType>('general');
    const [loading, setLoading] = useState(true);
    const [store, setStore] = useState<IStore | null>(null);
    const [storeAddress, setStoreAddress] = useState<IStoreAddress | null>(null);
    const [schedules, setSchedules] = useState<IStoreSchedule[]>([]);
    const [localSchedules, setLocalSchedules] = useState<IStoreSchedule[]>([]);
    const [logoPreview, setLogoPreview] = useState<string | null>(null);
    const [bannerPreview, setBannerPreview] = useState<string | null>(null);
    const [banner2Preview, setBanner2Preview] = useState<string | null>(null);
    const [banner3Preview, setBanner3Preview] = useState<string | null>(null);
    const [logoFile, setLogoFile] = useState<File | null>(null);
    const [bannerFile, setBannerFile] = useState<File | null>(null);
    const [banner2File, setBanner2File] = useState<File | null>(null);
    const [banner3File, setBanner3File] = useState<File | null>(null);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [showEmailModal, setShowEmailModal] = useState(false);
    const [emailForConfirm, setEmailForConfirm] = useState('');
    const [pendingPasswordData, setPendingPasswordData] = useState<PasswordFormData | null>(null);

    const { register: registerGeneral, handleSubmit: handleSubmitGeneral, formState: { errors: errorsGeneral }, reset: resetGeneral } = useForm<GeneralFormData>();
    const { register: registerPassword, handleSubmit: handleSubmitPassword, formState: { errors: errorsPassword }, reset: resetPassword } = useForm<PasswordFormData>();
    const { register: registerAddress, handleSubmit: handleSubmitAddress, formState: { errors: errorsAddress }, reset: resetAddress } = useForm<AddressFormData>();
    const { register: registerPayment, handleSubmit: handleSubmitPayment, setValue: setValuePayment, watch: watchPayment } = useForm<PaymentFormData>();
    const { register: registerSocial, handleSubmit: handleSubmitSocial, reset: resetSocial } = useForm<SocialFormData>();

    const paymentEnabled = watchPayment('payment_enabled');

    useEffect(() => {
        const tab = searchParams.get('tab');
        if (tab && ['general', 'media', 'password', 'address', 'payment', 'schedule', 'social'].includes(tab)) {
            setActiveTab(tab as TabType);
        }
    }, [searchParams]);

    useEffect(() => {
        loadStoreData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const loadStoreData = async () => {
        try {
            setLoading(true);
            const adminData = localStorage.getItem('adminData');
            if (!adminData) {
                navigate('/login');
                return;
            }

            const admin = JSON.parse(adminData);
            const storeId = admin.store_id;

            const storeData = await getStoreById(storeId);
            setStore(storeData);

            resetGeneral({
                cnpj: storeData.cnpj || '',
                slug: storeData.slug || '',
                phone_number: storeData.phone_number || '',
                description: storeData.description || ''
            });

            if (storeData.logo) {
                setLogoPreview(storeData.logo);
            }
            if (storeData.banner) {
                setBannerPreview(storeData.banner);
            }
            if (storeData.banner_2) {
                setBanner2Preview(storeData.banner_2);
            }
            if (storeData.banner_3) {
                setBanner3Preview(storeData.banner_3);
            }

            const addresses = await getStoreAddresses(storeId);
            if (addresses && addresses.length > 0) {
                const mainAddress = addresses.find((addr: IStoreAddress) => addr.is_main) || addresses[0];
                setStoreAddress(mainAddress);
                resetAddress({
                    street: mainAddress.street,
                    street_number: mainAddress.street_number,
                    complement: mainAddress.complement || '',
                    neighborhood: mainAddress.neighborhood,
                    reference_point: mainAddress.reference_point || '',
                    city: mainAddress.city,
                    state: mainAddress.state,
                    postal_code: mainAddress.postal_code || '',
                    country: mainAddress.country
                });
            }

            const schedulesData = await getStoreSchedules(storeId);
            setSchedules(schedulesData);
            setLocalSchedules(schedulesData);

            setValuePayment('mp_access_token', storeData.mp_access_token || '');
            setValuePayment('mp_public_key', storeData.mp_public_key || '');
            setValuePayment('mp_seller_id', storeData.mp_seller_id || '');
            setValuePayment('mp_webhook_secret', storeData.mp_webhook_secret || '');
            setValuePayment('inter_client_id', storeData.inter_client_id || '');
            setValuePayment('inter_client_secret', storeData.inter_client_secret || '');
            setValuePayment('inter_api_cert_path', storeData.inter_api_cert_path || '');
            setValuePayment('inter_api_key_path', storeData.inter_api_key_path || '');
            setValuePayment('payment_enabled', storeData.payment_enabled || false);

            resetSocial({
                facebook: storeData.facebook || '',
                instagram: storeData.instagram || '',
                youtube: storeData.youtube || ''
            });

        } catch (error) {
            console.error('Erro ao carregar dados da loja:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleTabChange = (tab: TabType) => {
        setActiveTab(tab);
        setSearchParams({ tab });
    };

    const handleLogoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setLogoFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setLogoPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleBannerChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setBannerFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setBannerPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleBanner2Change = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setBanner2File(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setBanner2Preview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleBanner3Change = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setBanner3File(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setBanner3Preview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleGeneralSubmit = async (data: GeneralFormData) => {
        if (!store) return;

        try {
            await updateStore(store.id, {
                cnpj: data.cnpj,
                slug: data.slug,
                phone_number: data.phone_number,
                description: data.description
            });
            alert('Informações gerais atualizadas com sucesso!');
            loadStoreData();
        } catch (error) {
            console.error('Erro ao salvar informações gerais:', error);
            alert('Erro ao salvar informações gerais.');
        }
    };

    const handleSaveMedia = async () => {
        if (!store) return;

        try {
            if (logoFile) {
                await uploadStoreLogo(store.id, logoFile);
            }
            if (bannerFile) {
                await uploadStoreBanner(store.id, bannerFile);
            }
            if (banner2File) {
                await uploadStoreBanner2(store.id, banner2File);
            }
            if (banner3File) {
                await uploadStoreBanner3(store.id, banner3File);
            }
            alert('Imagens atualizadas com sucesso!');
            loadStoreData();
        } catch (error) {
            console.error('Erro ao salvar imagens:', error);
            alert('Erro ao salvar imagens.');
        }
    };

    const handlePasswordSubmit = async (data: PasswordFormData) => {
        if (data.new_password !== data.confirm_password) {
            alert('As senhas não coincidem!');
            return;
        }

        if (data.new_password.length < 6) {
            alert('A senha deve ter no mínimo 6 caracteres.');
            return;
        }

        const adminData = localStorage.getItem('adminData');
        if (!adminData) {
            alert('Erro ao obter dados do administrador.');
            return;
        }

        const admin = JSON.parse(adminData);
        
        // Verificar se é SUPER_ADMIN
        if (admin.role !== 'SUPER_ADMIN') {
            alert('Apenas SUPER_ADMIN pode alterar senha nas configurações.');
            return;
        }

        // Armazenar dados e abrir modal para confirmar email
        setPendingPasswordData(data);
        setShowEmailModal(true);
    };

    const handleConfirmEmailAndChangePassword = async () => {
        if (!emailForConfirm) {
            alert('Por favor, digite seu email.');
            return;
        }

        if (!pendingPasswordData) {
            return;
        }

        try {
            await resetPasswordByEmail(emailForConfirm, pendingPasswordData.new_password);
            alert('Senha alterada com sucesso!');
            resetPassword();
            setShowEmailModal(false);
            setEmailForConfirm('');
            setPendingPasswordData(null);
        } catch (error: any) {
            console.error('Erro ao alterar senha:', error);
            const { status, data: errorData } = error.response || {};
            if (status === 400 && errorData?.message?.includes('not found')) {
                alert('Email não encontrado.');
            } else if (status === 401) {
                alert('Você não tem permissão para esta ação.');
            } else {
                alert('Erro ao alterar senha. Tente novamente mais tarde.');
            }
        }
    };

    const handleAddressSubmit = async (data: AddressFormData) => {
        if (!store) return;

        try {
            if (storeAddress) {
                await updateStoreAddress(storeAddress.id, data);
            } else {
                await createStoreAddress({
                    store_id: store.id,
                    ...data,
                    is_main: true
                });
            }
            alert('Endereço atualizado com sucesso!');
            loadStoreData();
        } catch (error) {
            console.error('Erro ao salvar endereço:', error);
            alert('Erro ao salvar endereço.');
        }
    };

    const handlePaymentSubmit = async (data: PaymentFormData) => {
        if (!store) return;

        try {
            await updateStore(store.id, {
                is_first_access: store.is_first_access
            });
            // TODO: Implementar updateStoreCredentials
            alert('Configurações de pagamento atualizadas com sucesso!');
            loadStoreData();
        } catch (error) {
            console.error('Erro ao salvar configurações de pagamento:', error);
            alert('Erro ao salvar configurações de pagamento.');
        }
    };

    const handleLocalScheduleChange = (scheduleId: string, field: string, value: string | boolean) => {
        setLocalSchedules(prev => 
            prev.map(schedule => 
                schedule.id === scheduleId 
                    ? { ...schedule, [field]: value }
                    : schedule
            )
        );
    };

    const handleSaveSchedules = async () => {
        if (!store) return;

        try {
            const schedulesData = localSchedules.map(schedule => ({
                day_of_week: schedule.day_of_week,
                is_closed: schedule.is_closed,
                opening_time: schedule.is_closed ? undefined : schedule.opening_time,
                closing_time: schedule.is_closed ? undefined : schedule.closing_time,
                lunch_break_start: schedule.is_closed ? undefined : schedule.lunch_break_start,
                lunch_break_end: schedule.is_closed ? undefined : schedule.lunch_break_end
            }));

            await updateStoreSchedules(store.id, { schedules: schedulesData });
            alert('Horários atualizados com sucesso!');
            loadStoreData();
        } catch (error) {
            console.error('Erro ao salvar horários:', error);
            alert('Erro ao salvar horários.');
        }
    };

    const handleSocialSubmit = async (data: SocialFormData) => {
        if (!store) return;

        try {
            await updateStore(store.id, {
                facebook: data.facebook,
                instagram: data.instagram,
                youtube: data.youtube
            });
            alert('Redes sociais atualizadas com sucesso!');
            loadStoreData();
        } catch (error) {
            console.error('Erro ao salvar redes sociais:', error);
            alert('Erro ao salvar redes sociais.');
        }
    };

    const renderGeneralTab = () => (
        <form onSubmit={handleSubmitGeneral(handleGeneralSubmit)}>
            <FormField>
                <Label>CNPJ</Label>
                <Input 
                    type="text" 
                    placeholder="00.000.000/0000-00"
                    {...registerGeneral('cnpj')}
                />
                <p style={{ color: 'var(--text-light)', fontSize: '0.85rem', marginTop: '0.25rem' }}>
                    CNPJ da empresa (opcional)
                </p>
            </FormField>

            <FormField>
                <Label>Identificador (Slug)<span>*</span></Label>
                <Input 
                    type="text" 
                    placeholder="minha-loja"
                    {...registerGeneral('slug', { required: 'Campo obrigatório' })}
                />
                <p style={{ color: 'var(--text-light)', fontSize: '0.85rem', marginTop: '0.25rem' }}>
                    Identificador único da loja na URL (use apenas letras minúsculas, números e hífens)
                </p>
                {errorsGeneral.slug && <ErrorMessage>{errorsGeneral.slug.message}</ErrorMessage>}
            </FormField>

            <FormField>
                <Label>Telefone<span>*</span></Label>
                <Input 
                    type="text" 
                    placeholder="(00) 00000-0000"
                    {...registerGeneral('phone_number', { required: 'Campo obrigatório' })}
                />
                <p style={{ color: 'var(--text-light)', fontSize: '0.85rem', marginTop: '0.25rem' }}>
                    Telefone de contato da loja
                </p>
                {errorsGeneral.phone_number && <ErrorMessage>{errorsGeneral.phone_number.message}</ErrorMessage>}
            </FormField>

            <FormField>
                <Label>Descrição</Label>
                <Textarea 
                    rows={4}
                    placeholder="Descreva sua loja, produtos e serviços..."
                    {...registerGeneral('description')}
                />
                <p style={{ color: 'var(--text-light)', fontSize: '0.85rem', marginTop: '0.25rem' }}>
                    Descrição que aparecerá na página da sua loja
                </p>
            </FormField>

            <ButtonGroup>
                <CancelButton type="button" onClick={() => loadStoreData()}>Cancelar</CancelButton>
                <SaveButton type="submit">Salvar Informações</SaveButton>
            </ButtonGroup>
        </form>
    );

    const renderMediaTab = () => (
        <MediaSection>
            <ImageUploadArea>
                <h3>
                    <FontAwesomeIcon icon={faStore} /> Logo da Loja (Avatar)
                </h3>
                <ImagePreview>
                    <AvatarPreview>
                        {logoPreview ? (
                            <img src={logoPreview} alt="Logo da loja" />
                        ) : (
                            <FontAwesomeIcon icon={faImage} />
                        )}
                    </AvatarPreview>
                    <FileInputLabel>
                        Escolher Imagem
                        <input type="file" accept="image/*" onChange={handleLogoChange} />
                    </FileInputLabel>
                </ImagePreview>
            </ImageUploadArea>

            <ImageUploadArea>
                <h3>
                    <FontAwesomeIcon icon={faImage} /> Banner 1 (Carousel)
                </h3>
                <ImagePreview>
                    <BannerPreview>
                        {bannerPreview ? (
                            <img src={bannerPreview} alt="Banner 1 da loja" />
                        ) : (
                            <FontAwesomeIcon icon={faImage} />
                        )}
                    </BannerPreview>
                    <FileInputLabel>
                        Escolher Imagem
                        <input type="file" accept="image/*" onChange={handleBannerChange} />
                    </FileInputLabel>
                </ImagePreview>
            </ImageUploadArea>

            <ImageUploadArea>
                <h3>
                    <FontAwesomeIcon icon={faImage} /> Banner 2 (Carousel)
                </h3>
                <ImagePreview>
                    <BannerPreview>
                        {banner2Preview ? (
                            <img src={banner2Preview} alt="Banner 2 da loja" />
                        ) : (
                            <FontAwesomeIcon icon={faImage} />
                        )}
                    </BannerPreview>
                    <FileInputLabel>
                        Escolher Imagem
                        <input type="file" accept="image/*" onChange={handleBanner2Change} />
                    </FileInputLabel>
                </ImagePreview>
            </ImageUploadArea>

            <ImageUploadArea>
                <h3>
                    <FontAwesomeIcon icon={faImage} /> Banner 3 (Carousel)
                </h3>
                <ImagePreview>
                    <BannerPreview>
                        {banner3Preview ? (
                            <img src={banner3Preview} alt="Banner 3 da loja" />
                        ) : (
                            <FontAwesomeIcon icon={faImage} />
                        )}
                    </BannerPreview>
                    <FileInputLabel>
                        Escolher Imagem
                        <input type="file" accept="image/*" onChange={handleBanner3Change} />
                    </FileInputLabel>
                </ImagePreview>
            </ImageUploadArea>

            <ButtonGroup>
                <SaveButton onClick={handleSaveMedia}>Salvar Alterações</SaveButton>
            </ButtonGroup>
        </MediaSection>
    );

    const renderPasswordTab = () => (
        <form onSubmit={handleSubmitPassword(handlePasswordSubmit)}>
            <FormField>
                <Label>Nova Senha<span>*</span></Label>
                <PasswordContainer>
                    <Input 
                        type={showNewPassword ? "text" : "password"} 
                        placeholder="Digite sua nova senha"
                        {...registerPassword('new_password', { 
                            required: 'Campo obrigatório',
                            minLength: {
                                value: 6,
                                message: 'A senha deve ter no mínimo 6 caracteres'
                            }
                        })}
                    />
                    <FontAwesomeIcon 
                        icon={showNewPassword ? faEye : faEyeSlash}
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        style={{ cursor: 'pointer', top: '15px' }}
                    />
                </PasswordContainer>
                {errorsPassword.new_password && <ErrorMessage>{errorsPassword.new_password.message}</ErrorMessage>}
            </FormField>

            <FormField>
                <Label>Confirmar Nova Senha<span>*</span></Label>
                <PasswordContainer>
                    <Input 
                        type={showConfirmPassword ? "text" : "password"} 
                        placeholder="Digite novamente sua nova senha"
                        {...registerPassword('confirm_password', { required: 'Campo obrigatório' })}
                    />
                    <FontAwesomeIcon 
                        icon={showConfirmPassword ? faEye : faEyeSlash}
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        style={{ cursor: 'pointer', top: '15px' }}
                    />
                </PasswordContainer>
                {errorsPassword.confirm_password && <ErrorMessage>{errorsPassword.confirm_password.message}</ErrorMessage>}
            </FormField>

            <p style={{ color: 'var(--text-light)', fontSize: '0.9rem', marginTop: '0.5rem', marginBottom: '1rem' }}>
                Apenas SUPER_ADMIN pode alterar senha por aqui. Você precisará confirmar seu email após clicar em "Alterar Senha".
            </p>

            <ButtonGroup>
                <CancelButton type="button" onClick={() => resetPassword()}>Cancelar</CancelButton>
                <SaveButton type="submit">Alterar Senha</SaveButton>
            </ButtonGroup>
        </form>
    );

    const renderAddressTab = () => (
        <form onSubmit={handleSubmitAddress(handleAddressSubmit)}>
            <FormGrid>
                <FormField>
                    <Label>CEP</Label>
                    <Input {...registerAddress('postal_code')} />
                    {errorsAddress.postal_code && <ErrorMessage>{errorsAddress.postal_code.message}</ErrorMessage>}
                </FormField>

                <FormField>
                    <Label>Estado<span>*</span></Label>
                    <Select {...registerAddress('state', { required: 'Campo obrigatório' })}>
                        <option value="">Selecione...</option>
                        {Object.entries(STATES).map(([key, value]) => (
                            <option key={key} value={key}>{value}</option>
                        ))}
                    </Select>
                    {errorsAddress.state && <ErrorMessage>{errorsAddress.state.message}</ErrorMessage>}
                </FormField>
            </FormGrid>

            <FormGrid>
                <FormField>
                    <Label>Cidade<span>*</span></Label>
                    <Input {...registerAddress('city', { required: 'Campo obrigatório' })} />
                    {errorsAddress.city && <ErrorMessage>{errorsAddress.city.message}</ErrorMessage>}
                </FormField>

                <FormField>
                    <Label>Bairro<span>*</span></Label>
                    <Input {...registerAddress('neighborhood', { required: 'Campo obrigatório' })} />
                    {errorsAddress.neighborhood && <ErrorMessage>{errorsAddress.neighborhood.message}</ErrorMessage>}
                </FormField>
            </FormGrid>

            <FormGrid>
                <FormField>
                    <Label>Rua<span>*</span></Label>
                    <Input {...registerAddress('street', { required: 'Campo obrigatório' })} />
                    {errorsAddress.street && <ErrorMessage>{errorsAddress.street.message}</ErrorMessage>}
                </FormField>

                <FormField>
                    <Label>Número<span>*</span></Label>
                    <Input {...registerAddress('street_number', { required: 'Campo obrigatório' })} />
                    {errorsAddress.street_number && <ErrorMessage>{errorsAddress.street_number.message}</ErrorMessage>}
                </FormField>
            </FormGrid>

            <FormField>
                <Label>Complemento</Label>
                <Input {...registerAddress('complement')} />
            </FormField>

            <FormField>
                <Label>Ponto de Referência</Label>
                <Input {...registerAddress('reference_point')} />
            </FormField>

            <FormField>
                <Label>País<span>*</span></Label>
                <Input {...registerAddress('country', { required: 'Campo obrigatório' })} defaultValue="Brasil" />
                {errorsAddress.country && <ErrorMessage>{errorsAddress.country.message}</ErrorMessage>}
            </FormField>

            <ButtonGroup>
                <CancelButton type="button" onClick={() => loadStoreData()}>Cancelar</CancelButton>
                <SaveButton type="submit">Salvar Endereço</SaveButton>
            </ButtonGroup>
        </form>
    );

    const renderPaymentTab = () => (
        <form onSubmit={handleSubmitPayment(handlePaymentSubmit)}>
            <CheckboxContainer>
                <Checkbox 
                    type="checkbox" 
                    {...registerPayment('payment_enabled')}
                />
                <Label noMargin>Habilitar pagamentos online</Label>
            </CheckboxContainer>

            <PaymentMethodCard>
                <h3>
                    <FontAwesomeIcon icon={faCreditCard} /> Mercado Pago
                </h3>
                <FormField>
                    <Label>Access Token</Label>
                    <Textarea 
                        rows={2}
                        placeholder="APP_USR-0000000000000000-000000-00000000000000000000000000000000-000000000"
                        {...registerPayment('mp_access_token')}
                        disabled={!paymentEnabled}
                    />
                </FormField>

                <FormField>
                    <Label>Public Key</Label>
                    <Textarea 
                        rows={2}
                        placeholder="APP_USR-00000000-0000-0000-0000-000000000000"
                        {...registerPayment('mp_public_key')}
                        disabled={!paymentEnabled}
                    />
                </FormField>

                <FormGrid>
                    <FormField>
                        <Label>Seller ID</Label>
                        <Input 
                            type="text" 
                            {...registerPayment('mp_seller_id')}
                            disabled={!paymentEnabled}
                        />
                    </FormField>

                    <FormField>
                        <Label>Webhook Secret</Label>
                        <Input 
                            type="text" 
                            {...registerPayment('mp_webhook_secret')}
                            disabled={!paymentEnabled}
                        />
                    </FormField>
                </FormGrid>
            </PaymentMethodCard>

            <PaymentMethodCard>
                <h3>
                    <FontAwesomeIcon icon={faCreditCard} /> Banco Inter
                </h3>
                <FormGrid>
                    <FormField>
                        <Label>Client ID</Label>
                        <Input 
                            type="text"
                            placeholder="ID do cliente da API"
                            {...registerPayment('inter_client_id')}
                            disabled={!paymentEnabled}
                        />
                    </FormField>

                    <FormField>
                        <Label>Client Secret</Label>
                        <Input 
                            type="text"
                            placeholder="Chave secreta do cliente"
                            {...registerPayment('inter_client_secret')}
                            disabled={!paymentEnabled}
                        />
                    </FormField>
                </FormGrid>

                <FormField>
                    <Label>Certificado da API (conteúdo .crt)</Label>
                    <Textarea 
                        rows={4}
                        placeholder="-----BEGIN CERTIFICATE-----&#10;...&#10;-----END CERTIFICATE-----"
                        {...registerPayment('inter_api_cert_path')}
                        disabled={!paymentEnabled}
                    />
                </FormField>

                <FormField>
                    <Label>Chave da API (conteúdo .key)</Label>
                    <Textarea 
                        rows={4}
                        placeholder="-----BEGIN RSA PRIVATE KEY-----&#10;...&#10;-----END RSA PRIVATE KEY-----"
                        {...registerPayment('inter_api_key_path')}
                        disabled={!paymentEnabled}
                    />
                </FormField>
            </PaymentMethodCard>

            <ButtonGroup>
                <CancelButton type="button" onClick={() => loadStoreData()}>Cancelar</CancelButton>
                <SaveButton type="submit">Salvar Configurações</SaveButton>
            </ButtonGroup>
        </form>
    );

    const renderSocialTab = () => (
        <form onSubmit={handleSubmitSocial(handleSocialSubmit)}>
            <FormField>
                <Label>Facebook</Label>
                <Input 
                    type="url" 
                    placeholder="https://facebook.com/sua-pagina"
                    {...registerSocial('facebook')}
                />
                <p style={{ color: 'var(--text-light)', fontSize: '0.85rem', marginTop: '0.25rem' }}>
                    Cole o link completo do seu perfil ou página no Facebook
                </p>
            </FormField>

            <FormField>
                <Label>Instagram</Label>
                <Input 
                    type="url" 
                    placeholder="https://instagram.com/seu-perfil"
                    {...registerSocial('instagram')}
                />
                <p style={{ color: 'var(--text-light)', fontSize: '0.85rem', marginTop: '0.25rem' }}>
                    Cole o link completo do seu perfil no Instagram
                </p>
            </FormField>

            <FormField>
                <Label>YouTube</Label>
                <Input 
                    type="url" 
                    placeholder="https://youtube.com/@seu-canal"
                    {...registerSocial('youtube')}
                />
                <p style={{ color: 'var(--text-light)', fontSize: '0.85rem', marginTop: '0.25rem' }}>
                    Cole o link completo do seu canal no YouTube
                </p>
            </FormField>

            <ButtonGroup>
                <CancelButton type="button" onClick={() => loadStoreData()}>Cancelar</CancelButton>
                <SaveButton type="submit">Salvar Redes Sociais</SaveButton>
            </ButtonGroup>
        </form>
    );

    const renderScheduleTab = () => (
        <>
            <ScheduleGrid>
                {DAYS_ORDER.map((day) => {
                    const schedule = localSchedules.find((s) => s.day_of_week === day);
                    if (!schedule) return null;

                    return (
                        <DayScheduleCard key={day}>
                            <CheckboxContainer>
                                <Checkbox
                                    type="checkbox"
                                    checked={schedule.is_closed}
                                    onChange={(e) => handleLocalScheduleChange(schedule.id, 'is_closed', e.target.checked)}
                                />
                                <h4>{DAY_LABELS[day]} - Fechado</h4>
                            </CheckboxContainer>

                            <ScheduleInputsRow>
                                <TimeInputGroup>
                                    <label>Horário de Abertura</label>
                                    <Input
                                        type="time"
                                        value={schedule.opening_time || ''}
                                        onChange={(e) => handleLocalScheduleChange(schedule.id, 'opening_time', e.target.value)}
                                        disabled={schedule.is_closed}
                                    />
                                </TimeInputGroup>

                                <TimeInputGroup>
                                    <label>Horário de Fechamento</label>
                                    <Input
                                        type="time"
                                        value={schedule.closing_time || ''}
                                        onChange={(e) => handleLocalScheduleChange(schedule.id, 'closing_time', e.target.value)}
                                        disabled={schedule.is_closed}
                                    />
                                </TimeInputGroup>

                                <TimeInputGroup>
                                    <label>Início do Almoço</label>
                                    <Input
                                        type="time"
                                        value={schedule.lunch_break_start || ''}
                                        onChange={(e) => handleLocalScheduleChange(schedule.id, 'lunch_break_start', e.target.value)}
                                        disabled={schedule.is_closed}
                                    />
                                </TimeInputGroup>

                                <TimeInputGroup>
                                    <label>Fim do Almoço</label>
                                    <Input
                                        type="time"
                                        value={schedule.lunch_break_end || ''}
                                        onChange={(e) => handleLocalScheduleChange(schedule.id, 'lunch_break_end', e.target.value)}
                                        disabled={schedule.is_closed}
                                    />
                                </TimeInputGroup>
                            </ScheduleInputsRow>
                        </DayScheduleCard>
                    );
                })}
            </ScheduleGrid>
            <ButtonGroup>
                <CancelButton type="button" onClick={() => setLocalSchedules(schedules)}>Cancelar</CancelButton>
                <SaveButton onClick={handleSaveSchedules}>Salvar Horários</SaveButton>
            </ButtonGroup>
        </>
    );

    if (loading) {
        return <LoadingContainer>Carregando...</LoadingContainer>;
    }

    return (
        <Container>
            <Header>
                <h1>
                    <FontAwesomeIcon icon={faCog} /> Configurações da Loja
                </h1>
            </Header>

            <TabsContainer>
                <Tab $active={activeTab === 'general'} onClick={() => handleTabChange('general')}>
                    <FontAwesomeIcon icon={faInfoCircle} /> Informações Gerais
                </Tab>
                <Tab $active={activeTab === 'media'} onClick={() => handleTabChange('media')}>
                    <FontAwesomeIcon icon={faImage} /> Mídia
                </Tab>
                <Tab $active={activeTab === 'password'} onClick={() => handleTabChange('password')}>
                    <FontAwesomeIcon icon={faLock} /> Senha
                </Tab>
                <Tab $active={activeTab === 'address'} onClick={() => handleTabChange('address')}>
                    <FontAwesomeIcon icon={faMapMarkerAlt} /> Endereço
                </Tab>
                <Tab $active={activeTab === 'payment'} onClick={() => handleTabChange('payment')}>
                    <FontAwesomeIcon icon={faCreditCard} /> Pagamento
                </Tab>
                <Tab $active={activeTab === 'schedule'} onClick={() => handleTabChange('schedule')}>
                    <FontAwesomeIcon icon={faClock} /> Horários de Funcionamento
                </Tab>
                <Tab $active={activeTab === 'social'} onClick={() => handleTabChange('social')}>
                    <FontAwesomeIcon icon={faShareNodes} /> Redes Sociais
                </Tab>
            </TabsContainer>

            <TabContent>
                {activeTab === 'general' && renderGeneralTab()}
                {activeTab === 'media' && renderMediaTab()}
                {activeTab === 'password' && renderPasswordTab()}
                {activeTab === 'address' && renderAddressTab()}
                {activeTab === 'payment' && renderPaymentTab()}
                {activeTab === 'schedule' && renderScheduleTab()}
                {activeTab === 'social' && renderSocialTab()}
            </TabContent>

            <Modal 
                isOpen={showEmailModal}
                onRequestClose={() => {
                    setShowEmailModal(false);
                    setEmailForConfirm('');
                }}
                overlayClassName="react-modal-overlay"
                className="react-modal-content"
            >
                <button 
                    type="button" 
                    onClick={() => {
                        setShowEmailModal(false);
                        setEmailForConfirm('');
                    }} 
                    className="modal-close"
                >
                    <FontAwesomeIcon icon={faXmark}/>
                </button>

                <ModalContainer>
                    <Form>
                        <h2>Confirmar Email</h2>
                        <p style={{ color: 'var(--text-light)', marginBottom: '1rem' }}>
                            Digite seu email para confirmar a alteração de senha:
                        </p>
                        <Input 
                            type="email" 
                            placeholder="seu-email@exemplo.com"
                            value={emailForConfirm}
                            onChange={(e) => setEmailForConfirm(e.target.value)}
                        />
                        <button 
                            type="button" 
                            className="create-button"
                            onClick={handleConfirmEmailAndChangePassword}
                        >
                            Confirmar e Alterar Senha
                        </button>
                    </Form>
                </ModalContainer>
            </Modal>
        </Container>
    );
}
