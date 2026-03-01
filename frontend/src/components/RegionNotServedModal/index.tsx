import Modal from 'react-modal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark, faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons';
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons';
import {
    Container,
    IconWrapper,
    Title,
    Message,
    WhatsAppButton,
    CloseLink,
} from './style';

interface RegionNotServedModalProps {
    isOpen: boolean;
    onRequestClose: () => void;
    city?: string;
    outOfRange?: boolean;
}

export function RegionNotServedModal({
    isOpen,
    onRequestClose,
    city,
    outOfRange = false,
}: RegionNotServedModalProps) {
    const storePhone = sessionStorage.getItem('storefront_store_phone') || '';
    const cleanNumber = storePhone.replace(/[^0-9]/g, '');
    const formattedNumber = cleanNumber.startsWith('55') ? cleanNumber : `55${cleanNumber}`;

    const whatsappText = outOfRange
        ? `Olá! Gostaria de verificar se vocês atendem meu endereço para entrega.`
        : `Olá! Gostaria de verificar se vocês entregam na cidade de ${city || 'minha região'}.`;

    const whatsappUrl = `https://wa.me/${formattedNumber}?text=${encodeURIComponent(whatsappText)}`;

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onRequestClose}
            overlayClassName="react-modal-overlay"
            className="react-modal-content"
        >
            <button type="button" onClick={onRequestClose} className="modal-close">
                <FontAwesomeIcon icon={faXmark} />
            </button>

            <Container>
                <IconWrapper>
                    <FontAwesomeIcon icon={faMapMarkerAlt as any} />
                </IconWrapper>

                <Title>
                    {outOfRange ? 'Fora da área de entrega' : 'Região não atendida'}
                </Title>

                <Message>
                    {outOfRange
                        ? 'Seu endereço está fora da área de entrega desta loja.'
                        : 'Esta loja não atende sua região no momento.'}
                </Message>

                <Message className="sub">
                    Entre em contato via WhatsApp para verificar possibilidades de entrega.
                </Message>

                <WhatsAppButton
                    as="a"
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <FontAwesomeIcon icon={faWhatsapp as any} />
                    Falar no WhatsApp
                </WhatsAppButton>

                <CloseLink type="button" onClick={onRequestClose}>
                    Fechar
                </CloseLink>
            </Container>
        </Modal>
    );
}
