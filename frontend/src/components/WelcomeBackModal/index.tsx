import Modal from 'react-modal';
import { Container } from './style';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXmark } from "@fortawesome/free-solid-svg-icons";

interface WelcomeBackModalProps{
    isOpen: boolean;
    onRequestClose: ()=> void;
    name: string
}

export function WelcomeBackModal({isOpen, onRequestClose, name}:WelcomeBackModalProps){
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
                <h2>Bem vindo {name}, ficamos muito felizes em tê-lo de volta! 😃</h2>
                <p>Ao preencher o formulário, selecione um endereço já cadastrado, ou crie um novo caso deseje.</p>
            </Container>
        </Modal>
    )
}