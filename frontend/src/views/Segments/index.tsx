import { useState, useEffect } from 'react';
import { listSegments, deleteSegment } from '../../services/segmentService';
import { ISegment } from '../../interfaces/segment';
import { SegmentModal } from '../../components/SegmentModal';
import { SegmentPreviewPanel } from '../../components/SegmentPreviewPanel';
import { DataTable, ColumnDef } from '../../components/DataTable';
import { RowActions, IconButton } from '../../components/DataTable/style';
import { Badge } from '../../components/Badge';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faPen, faTrash, faUsers } from '@fortawesome/free-solid-svg-icons';
import { Container, AddButton } from './styles';
import { PageHeader } from '../../styles/global';
import moment from 'moment';

export function Segments() {
    const [segments, setSegments] = useState<ISegment[]>([]);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalAction, setModalAction] = useState<'create' | 'edit'>('create');
    const [currentSegment, setCurrentSegment] = useState<ISegment | null>(null);
    const [isPreviewOpen, setIsPreviewOpen] = useState(false);
    const [segmentForPreview, setSegmentForPreview] = useState<ISegment | null>(null);

    const loadSegments = async () => {
        setLoading(true);
        try {
            const response = await listSegments(1, 50);
            setSegments(response.data.segments || []);
        } catch (error) {
            console.error('Failed to load segments:', error);
            alert('Erro ao carregar segmentos');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadSegments();
    }, []);

    const filteredSegments = segments.filter((segment) =>
        segment.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleOpenCreateModal = () => {
        setModalAction('create');
        setCurrentSegment(null);
        setIsModalOpen(true);
    };

    const handleOpenEditModal = (segment: ISegment) => {
        setModalAction('edit');
        setCurrentSegment(segment);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setCurrentSegment(null);
    };

    const handleOpenPreview = (segment: ISegment) => {
        setSegmentForPreview(segment);
        setIsPreviewOpen(true);
    };

    const handleClosePreview = () => {
        setIsPreviewOpen(false);
        setSegmentForPreview(null);
    };

    const handleSave = () => {
        loadSegments();
    };

    const handleDelete = async (id: string, name: string) => {
        if (window.confirm(`Tem certeza que deseja excluir o segmento "${name}"?`)) {
            try {
                await deleteSegment(id);
                alert('Segmento excluído com sucesso');
                loadSegments();
            } catch (error) {
                console.error('Failed to delete segment:', error);
                alert('Erro ao excluir segmento');
            }
        }
    };

    const describeCriteria = (segment: ISegment) => {
        if (segment.type === 'MANUAL') {
            return `Lista manual (${segment._count?.clients ?? 0} cliente(s))`;
        }
        const parts: string[] = [];
        if (segment.criteria?.purchase_recency) parts.push('Recência de compra');
        if (segment.criteria?.category) parts.push('Categoria');
        if (segment.criteria?.min_order_value) parts.push('Valor mínimo');
        if (segment.criteria?.min_order_count) parts.push('Qtd. mínima de pedidos');
        return parts.length > 0 ? parts.join(' + ') : '—';
    };

    const columns: ColumnDef<ISegment>[] = [
        {
            key: 'name',
            header: 'Nome',
            render: (segment) => (
                <strong style={{ color: 'var(--dt-accent)', fontSize: '14px' }}>
                    {segment.name}
                </strong>
            ),
        },
        {
            key: 'type',
            header: 'Tipo',
            render: (segment) => (
                <Badge tone={segment.type === 'DYNAMIC' ? 'info' : 'neutral'}>
                    {segment.type === 'DYNAMIC' ? 'Dinâmico' : 'Manual'}
                </Badge>
            ),
        },
        {
            key: 'criteria',
            header: 'Filtros',
            render: (segment) => <span>{describeCriteria(segment)}</span>,
        },
        {
            key: 'created_at',
            header: 'Criado em',
            render: (segment) => (
                <span>{segment.created_at ? moment(segment.created_at).format('DD/MM/YYYY') : '-'}</span>
            ),
        },
        {
            key: 'actions',
            header: 'Ações',
            render: (segment) => (
                <RowActions>
                    <IconButton $tone="view" title="Ver clientes do segmento" onClick={() => handleOpenPreview(segment)}>
                        <FontAwesomeIcon icon={faUsers} />
                    </IconButton>
                    <IconButton $tone="edit" title="Editar segmento" onClick={() => handleOpenEditModal(segment)}>
                        <FontAwesomeIcon icon={faPen} />
                    </IconButton>
                    <IconButton $tone="delete" title="Excluir segmento" onClick={() => handleDelete(segment.id, segment.name)}>
                        <FontAwesomeIcon icon={faTrash} />
                    </IconButton>
                </RowActions>
            ),
        },
    ];

    return (
        <Container>
            <PageHeader>
                <div>
                    <h1>🎯 Segmentos de Clientes</h1>
                </div>
                <AddButton onClick={handleOpenCreateModal}>
                    <FontAwesomeIcon icon={faPlus} />
                    Novo Segmento
                </AddButton>
            </PageHeader>

            <DataTable
                columns={columns}
                data={filteredSegments}
                rowKey={(segment) => segment.id}
                loading={loading}
                searchPlaceholder="Buscar por nome do segmento..."
                searchValue={searchTerm}
                onSearchChange={setSearchTerm}
                emptyTitle="Nenhum segmento encontrado"
                emptyDescription="Crie segmentos para organizar seus clientes e usá-los em campanhas de WhatsApp."
            />

            <SegmentModal
                isOpen={isModalOpen}
                onRequestClose={handleCloseModal}
                onSave={handleSave}
                currentSegment={currentSegment}
                action={modalAction}
            />

            <SegmentPreviewPanel
                isOpen={isPreviewOpen}
                onRequestClose={handleClosePreview}
                segment={segmentForPreview}
            />
        </Container>
    );
}
