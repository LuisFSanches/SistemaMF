import Modal from 'react-modal';
import { Container, DeleteButton } from './style';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXmark } from "@fortawesome/free-solid-svg-icons";

interface NewCategoryModalProps{
    isOpen: boolean;
    onRequestClose: ()=> void;
    handleAction: () => void;
    label: string
}

export function ConfirmPopUp({isOpen, onRequestClose, handleAction, label}:NewCategoryModalProps){

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
                <h2>Tem certeza que quer deletar?</h2>
                <DeleteButton type="button" onClick={handleAction}>
                    {label}
                </DeleteButton>
            </Container>
        </Modal>
    )
}