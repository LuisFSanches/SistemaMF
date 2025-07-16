import Modal from 'react-modal';
import {
    Container,
} from './style';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXmark } from "@fortawesome/free-solid-svg-icons";

interface AdminModalProps{
    isOpen: boolean;
    onRequestClose: ()=> void;
}

export function CompletedOrderModal({
    isOpen,
    onRequestClose,
}:AdminModalProps){
    return(
        <Modal 
            isOpen={isOpen}
            onRequestClose={onRequestClose}
            overlayClassName="react-modal-overlay"
            className="react-modal-content"
        >
            <Container>
                <h2>Pedido Concluído 💐</h2>
                <p>O pedido foi salvo e se encontra nos pedidos finalizados!</p>
                <button type="button" onClick={onRequestClose}>
                    <span>Fechar</span>
                    <FontAwesomeIcon icon={faXmark}/>
                </button>
            </Container>
        </Modal>
    )
}
