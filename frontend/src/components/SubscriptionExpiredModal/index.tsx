import Modal from 'react-modal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXmark, faExclamationTriangle } from "@fortawesome/free-solid-svg-icons";
import { ModalContainer, PrimaryButton } from '../../styles/global';
import { ModalContent, WarningIcon, Message, ButtonContainer } from './style';
import { useSubscription } from '../../contexts/SubscriptionContext';

interface SubscriptionExpiredModalProps {
    isOpen: boolean;
    onRequestClose: () => void;
}

export function SubscriptionExpiredModal({
    isOpen,
    onRequestClose
}: SubscriptionExpiredModalProps) {
    const { setShowPlanSelectorModal } = useSubscription();

    const handleRenewClick = () => {
        onRequestClose();
        setShowPlanSelectorModal(true);
    };

    return (
        <Modal 
            isOpen={isOpen}
            onRequestClose={onRequestClose}
            overlayClassName="react-modal-overlay"
            className="react-modal-content"
        >
            <button 
                type="button" 
                onClick={onRequestClose} 
                className="modal-close"
            >
                <FontAwesomeIcon icon={faXmark} />
            </button>

            <ModalContainer>
                <ModalContent>
                    <WarningIcon>
                        <FontAwesomeIcon icon={faExclamationTriangle} />
                    </WarningIcon>
                    
                    <h2>Assinatura Expirada</h2>
                    
                    <Message>
                        <p>Sua assinatura expirou e o acesso ao sistema está bloqueado.</p>
                        <p>Para continuar usando o sistema e gerenciar seus pedidos, renove sua assinatura agora mesmo.</p>
                    </Message>

                    <ButtonContainer>
                        <PrimaryButton onClick={handleRenewClick}>
                            Renovar Assinatura
                        </PrimaryButton>
                    </ButtonContainer>
                </ModalContent>
            </ModalContainer>
        </Modal>
    );
}
