import Modal from 'react-modal';
import { Container, ActionButtons } from './style';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXmark } from "@fortawesome/free-solid-svg-icons";

interface RememberCardModalProps{
    isOpen: boolean;
    onRequestClose: ()=> void;
    handleWriteMessageClick: () => void;
    handleNoMessageClick: () => void;
}

export function RememberCardModal({
    isOpen,
    onRequestClose,
    handleWriteMessageClick,
    handleNoMessageClick
}:RememberCardModalProps){
    return(
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
                <h2>Você quer enviar seu pedido sem um cartão?</h2>
                <p>Caso deseje, você pode adicionar uma mensagem personalizada que será entregue junto com o pedido.
                É um ótimo jeito de tornar o momento ainda mais especial. 💌</p>
                <ActionButtons>
                    <button className="write-message" onClick={handleWriteMessageClick}>Preencher mensagem</button>
                    <button className="no-message" type="submit" onClick={handleNoMessageClick}>Concluir sem mensagem</button>
                </ActionButtons>
            </Container>
        </Modal>
    )
}