import Modal from 'react-modal';
import { Container, WhatsappButton } from "./style";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { faWhatsapp } from "@fortawesome/free-brands-svg-icons";

interface ITooltipModal {
    isOpen: boolean;
    onRequestClose: () => void;
    textContent: string;
}

export function TooltipModal({
    isOpen,
    onRequestClose,
    textContent
}: ITooltipModal) {
    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onRequestClose}
            overlayClassName="react-modal-overlay"
            className="react-modal-content"
        >
            <button type="button" onClick={onRequestClose} className="modal-close">
                <FontAwesomeIcon icon={faXmark}/>
            </button>
            <Container>
                <p>{textContent}</p>
                <WhatsappButton href="https://wa.me//5522997517940?text=Poderia%20me%20ajudar%20?" target="_blank">
                    <FontAwesomeIcon icon={faWhatsapp as any}/>
                    Saber mais
                </WhatsappButton>
            </Container>
        </Modal>
    );
}