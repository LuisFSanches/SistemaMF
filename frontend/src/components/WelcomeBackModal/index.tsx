import Modal from 'react-modal';
import { Container, HeaderImage, SpamNotice } from './style';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXmark, faCircleInfo } from "@fortawesome/free-solid-svg-icons";
import welcomeModalHeader from '../../assets/images/welcome_modal_header.png';

interface WelcomeBackModalProps{
    isOpen: boolean;
    onRequestClose: ()=> void;
    name: string,
    textBody?: string,
    spamNotice?: string
}

export function WelcomeBackModal({isOpen, onRequestClose, name, textBody, spamNotice}:WelcomeBackModalProps){
    return(
        <Modal
            isOpen={isOpen}
            onRequestClose={onRequestClose}
            overlayClassName="react-modal-overlay"
            className="react-modal-content welcome-back-modal"
            >
            <button type="button" onClick={onRequestClose} className="modal-close">
                <FontAwesomeIcon icon={faXmark}/>
            </button>

            <HeaderImage>
                <img src={welcomeModalHeader} alt="" />
            </HeaderImage>

            <Container>
                <h2>Bem vindo {name}, ficamos muito felizes em ter você de volta! 😃</h2>
                <p>{textBody ||
                    "Ao preencher o formulário, selecione um endereço já cadastrado, ou crie um novo caso deseje."
                    }
                </p>

                {spamNotice && (
                    <SpamNotice>
                        <FontAwesomeIcon icon={faCircleInfo} />
                        <span>{spamNotice}</span>
                    </SpamNotice>
                )}

                <button onClick={onRequestClose}>Continuar</button>
            </Container>
        </Modal>
    )
}
