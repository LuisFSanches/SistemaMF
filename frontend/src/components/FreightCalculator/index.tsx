import { useState } from 'react';
import InputMask from 'react-input-mask';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faTruck,
    faSpinner,
    faExclamationTriangle,
    faSearch,
    faEdit,
    faMapMarkerAlt,
} from '@fortawesome/free-solid-svg-icons';
import {
    fetchAddressByCep,
    geocodeAddress,
    calculateDeliveryFee,
} from '../../services/deliveryService';
import { useCart } from '../../contexts/CartContext';
import { RegionNotServedModal } from '../RegionNotServedModal';
import { convertMoney } from '../../utils';
import {
    Wrapper,
    Title,
    CepForm,
    CepInputWrapper,
    CepInput,
    CepButton,
    AddressDisplay,
    AddressLine,
    ResultBox,
    ResultRow,
    ResultLabel,
    ResultValue,
    ErrorBox,
    ErrorText,
    ChangeButton,
    ManualHint,
    LoadingIconWrapper,
} from './style';

interface FreightCalculatorProps {
    compact?: boolean;
    hideTitle?: boolean;
}

type CalculatorState =
    | 'idle'
    | 'loading_cep'
    | 'loading_geocode'
    | 'loading_freight'
    | 'success'
    | 'error_out_of_range'
    | 'error_geocode'
    | 'error_network'
    | 'error_cep';

export function FreightCalculator({ compact = false, hideTitle = false }: FreightCalculatorProps) {
    const { setDeliveryInfo, clearDeliveryInfo, deliveryInfo } = useCart();

    const [cep, setCep] = useState(deliveryInfo?.cep || '');
    const [state, setState] = useState<CalculatorState>(
        deliveryInfo ? 'success' : 'idle'
    );
    const [errorMessage, setErrorMessage] = useState('');
    const [showRegionModal, setShowRegionModal] = useState(false);
    const [regionModalCity, setRegionModalCity] = useState('');
    const [isOutOfRange, setIsOutOfRange] = useState(false);
    const [addressPreview, setAddressPreview] = useState<{
        street: string;
        neighborhood: string;
        city: string;
        state: string;
    } | null>(
        deliveryInfo
            ? {
                  street: deliveryInfo.street,
                  neighborhood: deliveryInfo.neighborhood,
                  city: deliveryInfo.city,
                  state: deliveryInfo.state,
              }
            : null
    );

    const storeId = sessionStorage.getItem('storefront_store_id') || '';

    const loadingLabel: Record<string, string> = {
        loading_cep: 'Buscando endereço...',
        loading_geocode: 'Calculando localização...',
        loading_freight: 'Calculando frete...',
    };

    const isLoading = state.startsWith('loading_');

    const handleCalculate = async () => {
        const cleanCep = cep.replace(/\D/g, '');
        if (cleanCep.length !== 8) {
            setErrorMessage('Digite um CEP válido com 8 dígitos.');
            setState('error_cep');
            return;
        }

        if (!storeId) {
            setErrorMessage('Loja não identificada. Atualize a página.');
            setState('error_network');
            return;
        }

        clearDeliveryInfo();
        setErrorMessage('');

        try {
            setState('loading_cep');
            const address = await fetchAddressByCep(cleanCep);

            setAddressPreview({
                street: address.logradouro,
                neighborhood: address.bairro,
                city: address.localidade,
                state: address.uf,
            });

            setState('loading_geocode');
            let coordinates: { lat: number; lng: number };
            let geocodeFailed = false;

            try {
                coordinates = await geocodeAddress(
                    address.bairro,
                    address.localidade,
                    address.uf
                );
            } catch {
                geocodeFailed = true;
                // Fallback: try with just city + state
                try {
                    coordinates = await geocodeAddress('', address.localidade, address.uf);
                } catch {
                    setState('error_geocode');
                    return;
                }
            }

            setState('loading_freight');
            const result = await calculateDeliveryFee({
                storeId,
                customerLatitude: coordinates.lat,
                customerLongitude: coordinates.lng,
                city: address.localidade,
            });

            setDeliveryInfo({
                fee: result.delivery_price,
                distance_km: result.distance_km,
                cep: cleanCep,
                city: address.localidade,
                state: address.uf,
                neighborhood: address.bairro,
                street: address.logradouro,
            });

            setState('success');

            if (geocodeFailed) {
                setErrorMessage(
                    'Não encontramos seu bairro exato, mas calculamos com base na cidade.'
                );
            }
        } catch (err: any) {
            const errorData = err?.response?.data;
            const errorCode = errorData?.errorCode;
            const message: string = errorData?.message || '';

            if (errorCode === 422) {
                if (
                    message.includes('does not deliver') ||
                    message.includes('STORE_DOES_NOT_SERVE_CITY')
                ) {
                    setRegionModalCity(addressPreview?.city || '');
                    setIsOutOfRange(false);
                    setShowRegionModal(true);
                    setState('idle');
                } else if (
                    message.includes('not available for the distance') ||
                    message.includes('OUT_OF_DELIVERY_RANGE')
                ) {
                    setIsOutOfRange(true);
                    setRegionModalCity(addressPreview?.city || '');
                    setShowRegionModal(true);
                    setState('error_out_of_range');
                } else {
                    setErrorMessage('Entrega não disponível no momento.');
                    setState('error_network');
                }
            } else if (err?.message === 'CEP não encontrado') {
                setErrorMessage('CEP não encontrado. Verifique e tente novamente.');
                setState('error_cep');
            } else if (err?.code === 'ERR_NETWORK' || err?.message?.includes('Network')) {
                setErrorMessage('Erro de conexão. Verifique sua internet e tente novamente.');
                setState('error_network');
            } else {
                setErrorMessage('Erro ao calcular o frete. Tente novamente.');
                setState('error_network');
            }
        }
    };

    const handleReset = () => {
        setCep('');
        setState('idle');
        setErrorMessage('');
        setAddressPreview(null);
        clearDeliveryInfo();
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleCalculate();
        }
    };

    return (
        <>
            <Wrapper compact={compact}>
                {!hideTitle && (
                    <Title compact={compact}>
                        <FontAwesomeIcon icon={faTruck as any} />
                        Calcular Entrega
                    </Title>
                )}

                {state !== 'success' && (
                    <CepForm>
                        <CepInputWrapper>
                            <InputMask
                                mask="99999-999"
                                value={cep}
                                onChange={(e) => setCep(e.target.value)}
                                onKeyDown={handleKeyDown}
                                disabled={isLoading}
                            >
                                {(inputProps: any) => (
                                    <CepInput
                                        {...inputProps}
                                        placeholder="00000-000"
                                        type="text"
                                        hasError={
                                            state === 'error_cep' ||
                                            state === 'error_network' ||
                                            state === 'error_geocode'
                                        }
                                    />
                                )}
                            </InputMask>
                            <CepButton
                                type="button"
                                onClick={handleCalculate}
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <LoadingIconWrapper>
                                        <FontAwesomeIcon icon={faSpinner as any} />
                                    </LoadingIconWrapper>
                                ) : (
                                    <FontAwesomeIcon icon={faSearch as any} />
                                )}
                                {isLoading ? loadingLabel[state] || 'Calculando...' : 'Calcular'}
                            </CepButton>
                        </CepInputWrapper>

                        {addressPreview && isLoading && (
                            <AddressDisplay>
                                <FontAwesomeIcon icon={faMapMarkerAlt as any} />
                                <AddressLine>
                                    {[
                                        addressPreview.street,
                                        addressPreview.neighborhood,
                                        `${addressPreview.city} - ${addressPreview.state}`,
                                    ]
                                        .filter(Boolean)
                                        .join(', ')}
                                </AddressLine>
                            </AddressDisplay>
                        )}

                        {(state === 'error_cep' ||
                            state === 'error_network' ||
                            state === 'error_geocode' ||
                            state === 'error_out_of_range') &&
                            errorMessage && (
                                <ErrorBox>
                                    <FontAwesomeIcon icon={faExclamationTriangle as any} />
                                    <ErrorText>{errorMessage}</ErrorText>
                                </ErrorBox>
                            )}

                        {state === 'error_geocode' && (
                            <ManualHint>
                                Não foi possível calcular sua localização. Tente novamente com seu
                                CEP ou entre em contato via WhatsApp.
                            </ManualHint>
                        )}
                    </CepForm>
                )}

                {state === 'success' && deliveryInfo && (
                    <>
                        {addressPreview && (
                            <AddressDisplay>
                                <FontAwesomeIcon icon={faMapMarkerAlt as any} />
                                <AddressLine>
                                    {[
                                        addressPreview.street,
                                        addressPreview.neighborhood,
                                        `${addressPreview.city} - ${addressPreview.state}`,
                                    ]
                                        .filter(Boolean)
                                        .join(', ')}
                                </AddressLine>
                            </AddressDisplay>
                        )}

                        <ResultBox>
                            <ResultRow className="highlight">
                                <ResultLabel>Taxa de entrega:</ResultLabel>
                                <ResultValue className="highlight">
                                    {convertMoney(deliveryInfo.fee)}
                                </ResultValue>
                            </ResultRow>
                        </ResultBox>

                        {errorMessage && (
                            <ManualHint>{errorMessage}</ManualHint>
                        )}

                        <ChangeButton type="button" onClick={handleReset}>
                            <FontAwesomeIcon icon={faEdit as any} />
                            Alterar endereço
                        </ChangeButton>
                    </>
                )}
            </Wrapper>

            <RegionNotServedModal
                isOpen={showRegionModal}
                onRequestClose={() => setShowRegionModal(false)}
                city={regionModalCity}
                outOfRange={isOutOfRange}
            />
        </>
    );
}
