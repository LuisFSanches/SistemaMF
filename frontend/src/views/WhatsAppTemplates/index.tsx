import { useState, useEffect } from 'react';
import { listWhatsAppTemplates, deleteWhatsAppTemplate } from '../../services/whatsappTemplateService';
import { IWhatsAppTemplate } from '../../interfaces/whatsappTemplate';
import { WhatsAppTemplateModal } from '../../components/WhatsAppTemplateModal';
import { DataTable, ColumnDef } from '../../components/DataTable';
import { RowActions, IconButton } from '../../components/DataTable/style';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faPen, faTrash } from '@fortawesome/free-solid-svg-icons';
import { Container, AddButton } from './styles';
import { PageHeader } from '../../styles/global';

export function WhatsAppTemplates() {
    const [templates, setTemplates] = useState<IWhatsAppTemplate[]>([]);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalAction, setModalAction] = useState<'create' | 'edit'>('create');
    const [currentTemplate, setCurrentTemplate] = useState<IWhatsAppTemplate | null>(null);

    const loadTemplates = async () => {
        setLoading(true);
        try {
            const response = await listWhatsAppTemplates();
            setTemplates(response.data.templates || []);
        } catch (error) {
            console.error('Failed to load templates:', error);
            alert('Erro ao carregar templates');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadTemplates();
    }, []);

    const filteredTemplates = templates.filter((template) =>
        template.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleOpenCreateModal = () => {
        setModalAction('create');
        setCurrentTemplate(null);
        setIsModalOpen(true);
    };

    const handleOpenEditModal = (template: IWhatsAppTemplate) => {
        setModalAction('edit');
        setCurrentTemplate(template);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setCurrentTemplate(null);
    };

    const handleSave = () => {
        loadTemplates();
    };

    const handleDelete = async (id: string, name: string) => {
        if (window.confirm(`Tem certeza que deseja excluir o template "${name}"?`)) {
            try {
                await deleteWhatsAppTemplate(id);
                alert('Template excluído com sucesso');
                loadTemplates();
            } catch (error: any) {
                console.error('Failed to delete template:', error);
                const message = error.response?.data?.message || 'Erro ao excluir template';
                alert(message);
            }
        }
    };

    const columns: ColumnDef<IWhatsAppTemplate>[] = [
        {
            key: 'name',
            header: 'Nome',
            render: (template) => (
                <strong style={{ color: 'var(--dt-accent)', fontSize: '14px' }}>
                    {template.name}
                </strong>
            ),
        },
        {
            key: 'language_code',
            header: 'Idioma',
            render: (template) => <span>{template.language_code}</span>,
        },
        {
            key: 'variables',
            header: 'Variáveis',
            render: (template) => <span>{template.variable_count}</span>,
        },
        {
            key: 'actions',
            header: 'Ações',
            render: (template) => (
                <RowActions>
                    <IconButton $tone="edit" title="Editar template" onClick={() => handleOpenEditModal(template)}>
                        <FontAwesomeIcon icon={faPen} />
                    </IconButton>
                    <IconButton $tone="delete" title="Excluir template" onClick={() => handleDelete(template.id, template.name)}>
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
                    <h1>📱 Templates WhatsApp</h1>
                </div>
                <AddButton onClick={handleOpenCreateModal}>
                    <FontAwesomeIcon icon={faPlus} />
                    Novo Template
                </AddButton>
            </PageHeader>

            <DataTable
                columns={columns}
                data={filteredTemplates}
                rowKey={(template) => template.id}
                loading={loading}
                searchPlaceholder="Buscar por nome do template..."
                searchValue={searchTerm}
                onSearchChange={setSearchTerm}
                emptyTitle="Nenhum template encontrado"
                emptyDescription="Cadastre os templates aprovados no Meta Business Manager para usá-los em campanhas."
            />

            <WhatsAppTemplateModal
                isOpen={isModalOpen}
                onRequestClose={handleCloseModal}
                onSave={handleSave}
                currentTemplate={currentTemplate}
                action={modalAction}
            />
        </Container>
    );
}
