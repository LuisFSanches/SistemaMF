import Modal from 'react-modal';
import { Container } from './style';

interface UserOrdersModal{
    isOpen: boolean,
    onRequestClose: ()=> void;
}

export function UserOrdersModal({isOpen, onRequestClose}:UserOrdersModal){
    return(
        <Modal
            isOpen={isOpen}
            onAfterClose={onRequestClose}
            overlayClassName="react-modal-overlay"
            className="react-modal-content"
        >

            <Container>
                <h2>Todos os Pedidos</h2>
                <div className="user-info">
                    <h3>Luis Felipe Sanches</h3>
                    <p>(22)999661519</p>
                    <p>luis-lipe@hotmail.com</p>
                </div>
            </Container>

        </Modal>
    )
}