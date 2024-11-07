import Modal from 'react-modal';
import { Container } from './style';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXmark } from "@fortawesome/free-solid-svg-icons";

interface NewCategoryModalProps{
    isOpen: boolean;
    onRequestClose: ()=> void;
}

export function NewCategoryModal({isOpen, onRequestClose}:NewCategoryModalProps){
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
                <h2>Cadastrar nova categoria</h2>
                <input placeholder='Url da imagem' />
                <input placeholder='Nome da categoria' />
                <button type="submit" className="create-button">
                    Criar categoria
                </button>
            </Container>

        </Modal>
    )

}