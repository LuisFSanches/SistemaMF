import { useState, useEffect } from 'react';
import { listSpecialDates, deleteSpecialDate } from '../../services/specialDateService';
import { ISpecialDate } from '../../interfaces/specialDate';
import { SpecialDateModal } from '../../components/SpecialDateModal';
import { DataTable, ColumnDef } from '../../components/DataTable';
import { RowActions, IconButton } from '../../components/DataTable/style';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faPen, faTrash } from '@fortawesome/free-solid-svg-icons';
import { Container, AddButton } from './styles';
import { PageHeader } from '../../styles/global';
import moment from 'moment';

export function SpecialDates() {
    const [specialDates, setSpecialDates] = useState<ISpecialDate[]>([]);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalAction, setModalAction] = useState<'create' | 'edit'>('create');
    const [currentSpecialDate, setCurrentSpecialDate] = useState<ISpecialDate | null>(null);

    const loadSpecialDates = async () => {
        setLoading(true);
        try {
            const response = await listSpecialDates();
            setSpecialDates(response.data.specialDates || []);
        } catch (error) {
            console.error('Failed to load special dates:', error);
            alert('Erro ao carregar datas especiais');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadSpecialDates();
    }, []);

    const filteredSpecialDates = specialDates.filter((specialDate) =>
        specialDate.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleOpenCreateModal = () => {
        setModalAction('create');
        setCurrentSpecialDate(null);
        setIsModalOpen(true);
    };

    const handleOpenEditModal = (specialDate: ISpecialDate) => {
        setModalAction('edit');
        setCurrentSpecialDate(specialDate);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setCurrentSpecialDate(null);
    };

    const handleSave = () => {
        loadSpecialDates();
    };

    const handleDelete = async (id: string, name: string) => {
        if (window.confirm(`Tem certeza que deseja excluir a data especial "${name}"?`)) {
            try {
                await deleteSpecialDate(id);
                alert('Data especial excluída com sucesso');
                loadSpecialDates();
            } catch (error: any) {
                console.error('Failed to delete special date:', error);
                const message = error.response?.data?.message || 'Erro ao excluir data especial';
                alert(message);
            }
        }
    };

    const columns: ColumnDef<ISpecialDate>[] = [
        {
            key: 'name',
            header: 'Nome',
            render: (specialDate) => (
                <strong style={{ color: 'var(--dt-accent)', fontSize: '14px' }}>
                    {specialDate.name}
                </strong>
            ),
        },
        {
            key: 'date',
            header: 'Data',
            render: (specialDate) => (
                <span>{moment.utc(specialDate.date).format('DD/MM/YYYY')}</span>
            ),
        },
        {
            key: 'actions',
            header: 'Ações',
            render: (specialDate) => (
                <RowActions>
                    <IconButton $tone="edit" title="Editar data especial" onClick={() => handleOpenEditModal(specialDate)}>
                        <FontAwesomeIcon icon={faPen} />
                    </IconButton>
                    <IconButton $tone="delete" title="Excluir data especial" onClick={() => handleDelete(specialDate.id, specialDate.name)}>
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
                    <h1>📅 Datas Especiais</h1>
                </div>
                <AddButton onClick={handleOpenCreateModal}>
                    <FontAwesomeIcon icon={faPlus} />
                    Nova Data Especial
                </AddButton>
            </PageHeader>

            <DataTable
                columns={columns}
                data={filteredSpecialDates}
                rowKey={(specialDate) => specialDate.id}
                loading={loading}
                searchPlaceholder="Buscar por nome..."
                searchValue={searchTerm}
                onSearchChange={setSearchTerm}
                emptyTitle="Nenhuma data especial encontrada"
                emptyDescription="Crie datas especiais como Dia das Mães ou Dia dos Namorados para usar em segmentos."
            />

            <SpecialDateModal
                isOpen={isModalOpen}
                onRequestClose={handleCloseModal}
                onSave={handleSave}
                currentSpecialDate={currentSpecialDate}
                action={modalAction}
            />
        </Container>
    );
}
