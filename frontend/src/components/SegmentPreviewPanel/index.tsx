import { useEffect, useState } from 'react';
import Modal from 'react-modal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { ModalContainer } from '../../styles/global';
import { previewSegment } from '../../services/segmentService';
import { ISegment, ISegmentClient } from '../../interfaces/segment';
import { Loader } from '../Loader';
import { PreviewContainer, PreviewSummary, ClientList, ClientRow } from './styles';

interface SegmentPreviewPanelProps {
    isOpen: boolean;
    onRequestClose: () => void;
    segment: ISegment | null;
}

export function SegmentPreviewPanel({ isOpen, onRequestClose, segment }: SegmentPreviewPanelProps) {
    const [loading, setLoading] = useState(false);
    const [total, setTotal] = useState(0);
    const [clients, setClients] = useState<ISegmentClient[]>([]);

    useEffect(() => {
        if (!isOpen || !segment) return;

        setLoading(true);
        previewSegment(segment.id, 1, 50)
            .then((response) => {
                setTotal(response.data.total);
                setClients(response.data.clients || []);
            })
            .catch((error) => {
                console.error('Failed to preview segment:', error);
                alert('Erro ao carregar clientes do segmento');
            })
            .finally(() => setLoading(false));
    }, [isOpen, segment]);

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onRequestClose}
            overlayClassName="react-modal-overlay"
            className="react-modal-content-medium"
        >
            <Loader show={loading} />
            <button type="button" onClick={onRequestClose} className="modal-close">
                <FontAwesomeIcon icon={faXmark} />
            </button>

            <ModalContainer>
                <PreviewContainer>
                    <h2>👥 Clientes do Segmento{segment ? `: ${segment.name}` : ''}</h2>

                    <PreviewSummary>
                        <strong>{total}</strong> cliente(s) encontrado(s)
                    </PreviewSummary>

                    <ClientList>
                        {clients.map((client) => (
                            <ClientRow key={client.id}>
                                <span>{client.first_name} {client.last_name}</span>
                                <span>{client.phone_number}</span>
                            </ClientRow>
                        ))}
                    </ClientList>
                </PreviewContainer>
            </ModalContainer>
        </Modal>
    );
}
