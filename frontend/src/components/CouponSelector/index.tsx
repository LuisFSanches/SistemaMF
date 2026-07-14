import { useState } from 'react';
import Modal from 'react-modal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { validateCoupon, getCouponErrorMessage, IAppliedCoupon } from '../../services/couponService';
import {
    ModalContent,
    ModalHeader,
    ModalTitle,
    ModalBody,
    InputSection,
    InputLabel,
    CouponCodeInput,
    ApplyCouponButton,
    ErrorMessage,
    SuccessMessage,
    Divider,
    CancelButton
} from './styles';

Modal.setAppElement('#root');

interface ICouponSelectorProps {
    isOpen: boolean;
    onRequestClose: () => void;
    onSelectCoupon: (coupon: IAppliedCoupon) => void;
    orderTotal: number;
    storeId: string;
    customerId?: string;
}

export function CouponSelector({
    isOpen,
    onRequestClose,
    onSelectCoupon,
    orderTotal,
    storeId,
    customerId
}: ICouponSelectorProps) {
    const [couponCode, setCouponCode] = useState('');
    const [validating, setValidating] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleApplyCoupon = async () => {
        // Clear previous messages
        setError('');
        setSuccess('');

        // Validate input
        if (!couponCode.trim()) {
            setError('Digite um código de cupom');
            return;
        }

        setValidating(true);

        try {
            const response = await validateCoupon({
                code: couponCode.toUpperCase().trim(),
                store_id: storeId,
                customerId,
                orderTotal
            });

            if (response.data.valid) {
                setSuccess('Cupom aplicado com sucesso! 🎉');
                
                // Call parent callback with coupon data
                setTimeout(() => {
                    onSelectCoupon({
                        code: response.data.coupon!.code,
                        coupon_id: response.data.coupon!.id,
                        discount_amount: response.data.discount_amount!
                    });
                    handleClose();
                }, 500);
            } else {
                setError(getCouponErrorMessage(response.data.error_code));
            }
        } catch (err: any) {
            console.error('[CouponSelector] Validation error:', err);
            setError(getCouponErrorMessage('NETWORK_ERROR'));
        } finally {
            setValidating(false);
        }
    };

    const handleClose = () => {
        setCouponCode('');
        setError('');
        setSuccess('');
        onRequestClose();
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !validating) {
            handleApplyCoupon();
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={handleClose}
            overlayClassName="react-modal-overlay"
            className="react-modal-content"
        >
            <button type="button" onClick={handleClose} className="modal-close">
                <FontAwesomeIcon icon={faXmark} />
            </button>

            <ModalContent>
                <ModalHeader>
                    <ModalTitle>Aplicar Cupom de Desconto 🎁</ModalTitle>
                </ModalHeader>

                <ModalBody>
                    <InputSection>
                        <InputLabel>Código do Cupom</InputLabel>
                        <CouponCodeInput
                            type="text"
                            placeholder="Digite o código do cupom"
                            value={couponCode}
                            onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                            onKeyPress={handleKeyPress}
                            disabled={validating}
                        />

                        {error && <ErrorMessage>❌ {error}</ErrorMessage>}
                        {success && <SuccessMessage>✅ {success}</SuccessMessage>}

                        <ApplyCouponButton
                            type="button"
                            onClick={handleApplyCoupon}
                            disabled={validating || !couponCode.trim()}
                        >
                            {validating ? (
                                <span>Validando...</span>
                            ) : (
                                'Aplicar Cupom'
                            )}
                        </ApplyCouponButton>
                    </InputSection>

                    <Divider>
                        <span>ou</span>
                    </Divider>

                    <CancelButton type="button" onClick={handleClose}>
                        Cancelar
                    </CancelButton>
                </ModalBody>
            </ModalContent>
        </Modal>
    );
}
