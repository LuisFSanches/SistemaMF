import { useState, useEffect } from 'react';
import { listCampaigns, dispatchCampaign, deleteCampaign } from '../../services/campaignService';
import { ICampaign, CampaignStatus } from '../../interfaces/campaign';
import { CampaignModal } from '../../components/CampaignModal';
import { DataTable, ColumnDef } from '../../components/DataTable';
import { RowActions, IconButton } from '../../components/DataTable/style';
import { Badge, BadgeTone } from '../../components/Badge';
import { ProgressBar } from '../../components/ProgressBar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faTrash, faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import { Container, AddButton } from './styles';
import { PageHeader } from '../../styles/global';
import moment from 'moment';

export function Campaigns() {
    const [campaigns, setCampaigns] = useState<ICampaign[]>([]);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);

    const loadCampaigns = async () => {
        setLoading(true);
        try {
            const response = await listCampaigns(1, 50);
            setCampaigns(response.data.campaigns || []);
        } catch (error) {
            console.error('Failed to load campaigns:', error);
            alert('Erro ao carregar campanhas');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadCampaigns();
    }, []);

    const filteredCampaigns = campaigns.filter((campaign) =>
        campaign.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleOpenCreateModal = () => setIsModalOpen(true);
    const handleCloseModal = () => setIsModalOpen(false);
    const handleSave = () => loadCampaigns();

    const handleDispatch = async (id: string, name: string) => {
        if (window.confirm(`Tem certeza que deseja disparar a campanha "${name}"? Essa ação enviará mensagens reais e não pode ser desfeita.`)) {
            try {
                await dispatchCampaign(id);
                alert('Campanha disparada com sucesso');
                loadCampaigns();
            } catch (error: any) {
                console.error('Failed to dispatch campaign:', error);
                const message = error.response?.data?.message || 'Erro ao disparar campanha';
                alert(message);
            }
        }
    };

    const handleDelete = async (id: string, name: string) => {
        if (window.confirm(`Tem certeza que deseja excluir a campanha "${name}"?`)) {
            try {
                await deleteCampaign(id);
                alert('Campanha excluída com sucesso');
                loadCampaigns();
            } catch (error: any) {
                console.error('Failed to delete campaign:', error);
                const message = error.response?.data?.message || 'Erro ao excluir campanha';
                alert(message);
            }
        }
    };

    const getStatusLabel = (status: CampaignStatus) => {
        const labels: Record<CampaignStatus, string> = {
            DRAFT: 'Rascunho',
            QUEUED: 'Na Fila',
            SENDING: 'Enviando',
            COMPLETED: 'Concluída',
            FAILED: 'Falhou',
        };
        return labels[status] || status;
    };

    const getStatusTone = (status: CampaignStatus): BadgeTone => {
        const tones: Record<CampaignStatus, BadgeTone> = {
            DRAFT: 'neutral',
            QUEUED: 'info',
            SENDING: 'warn',
            COMPLETED: 'good',
            FAILED: 'bad',
        };
        return tones[status] || 'neutral';
    };

    const columns: ColumnDef<ICampaign>[] = [
        {
            key: 'name',
            header: 'Nome',
            render: (campaign) => (
                <strong style={{ color: 'var(--dt-accent)', fontSize: '14px' }}>
                    {campaign.name}
                </strong>
            ),
        },
        {
            key: 'segment',
            header: 'Segmento',
            render: (campaign) => <span>{campaign.segment?.name || '-'}</span>,
        },
        {
            key: 'template',
            header: 'Template',
            render: (campaign) => <span>{campaign.template?.name || '-'}</span>,
        },
        {
            key: 'status',
            header: 'Status',
            render: (campaign) => (
                <Badge tone={getStatusTone(campaign.status)}>
                    {getStatusLabel(campaign.status)}
                </Badge>
            ),
        },
        {
            key: 'progress',
            header: 'Progresso',
            render: (campaign) => (
                campaign.total_recipients > 0
                    ? <ProgressBar value={campaign.sent_count} max={campaign.total_recipients} />
                    : <span>-</span>
            ),
        },
        {
            key: 'created_at',
            header: 'Criada em',
            render: (campaign) => (
                <span>{campaign.created_at ? moment(campaign.created_at).format('DD/MM/YYYY') : '-'}</span>
            ),
        },
        {
            key: 'actions',
            header: 'Ações',
            render: (campaign) => (
                <RowActions>
                    {campaign.status === 'DRAFT' && (
                        <>
                            <IconButton $tone="view" title="Disparar campanha" onClick={() => handleDispatch(campaign.id, campaign.name)}>
                                <FontAwesomeIcon icon={faPaperPlane} />
                            </IconButton>
                            <IconButton $tone="delete" title="Excluir campanha" onClick={() => handleDelete(campaign.id, campaign.name)}>
                                <FontAwesomeIcon icon={faTrash} />
                            </IconButton>
                        </>
                    )}
                </RowActions>
            ),
        },
    ];

    return (
        <Container>
            <PageHeader>
                <div>
                    <h1>📢 Campanhas de WhatsApp</h1>
                </div>
                <AddButton onClick={handleOpenCreateModal}>
                    <FontAwesomeIcon icon={faPlus} />
                    Nova Campanha
                </AddButton>
            </PageHeader>

            <DataTable
                columns={columns}
                data={filteredCampaigns}
                rowKey={(campaign) => campaign.id}
                loading={loading}
                searchPlaceholder="Buscar por nome da campanha..."
                searchValue={searchTerm}
                onSearchChange={setSearchTerm}
                emptyTitle="Nenhuma campanha encontrada"
                emptyDescription="Crie uma campanha para disparar mensagens de WhatsApp para um segmento de clientes."
            />

            <CampaignModal
                isOpen={isModalOpen}
                onRequestClose={handleCloseModal}
                onSave={handleSave}
            />
        </Container>
    );
}
