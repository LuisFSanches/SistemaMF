import Modal from 'react-modal';
import {
    Container,
} from './style';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { IAdmin } from '../../interfaces/IAdmin';
import { PrintOrder } from '../PrintOrder';

interface AdminModalProps{
    isOpen: boolean;
    onRequestClose: ()=> void;
    order: any,
    orderCode: string,
    admins: IAdmin[]
}

export function CompletedOrderModal({
    isOpen,
    onRequestClose,
    order,
    orderCode,
    admins
}: AdminModalProps) {
    return (
        <Modal
        isOpen={isOpen}
        onRequestClose={onRequestClose}
        overlayClassName="react-modal-overlay"
        className="react-modal-content"
        >
            <Container>
                <h2>Pedido Concluído 💐</h2>
                <p>O pedido foi salvo e se encontra nos pedidos finalizados!</p>
                <div>
                <PrintOrder
                    order={order}
                    orderCode={orderCode}
                    admins={admins}
                    clientName={`${order.first_name} ${order.last_name}`}
                    clientTelephone={order.phone_number}
                    buttonLabel="Imprimir"
                />
                <button type="button" onClick={onRequestClose}>
                    <span>Fechar</span>
                    <FontAwesomeIcon icon={faXmark} />
                </button>
                </div>
            </Container>
        </Modal>
    );
}

