import { useState, useEffect } from "react";
import { ICategory } from "../../interfaces/ICategory";
import categoryService from "../../services/categoryService";
import { Container } from "./style";
import { PageHeader, PrimaryButton } from "../../styles/global";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen, faTrash, faPlus } from "@fortawesome/free-solid-svg-icons";
import { CategoryModal } from "../../components/CategoryModal";
import { ConfirmPopUp } from "../../components/ConfirmPopUp";
import { useSuccessMessage } from "../../contexts/SuccessMessageContext";

export function CategoriesPage() {
    const [categories, setCategories] = useState<ICategory[]>([]);
    const [loading, setLoading] = useState(true);
    const [categoryModal, setCategoryModal] = useState(false);
    const [currentCategory, setCurrentCategory] = useState<ICategory | null>(null);
    const [deleteConfirm, setDeleteConfirm] = useState(false);
    const [categoryToDelete, setCategoryToDelete] = useState<string | null>(null);
    const { showSuccess } = useSuccessMessage();

    const loadCategories = async () => {
        try {
            setLoading(true);
            const data = await categoryService.getAllCategories();
            setCategories(data);
        } catch (error) {
            console.error("Erro ao carregar categorias:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadCategories();
    }, []);

    const handleOpenCreateModal = () => {
        setCurrentCategory(null);
        setCategoryModal(true);
    };

    const handleOpenEditModal = (category: ICategory) => {
        setCurrentCategory(category);
        setCategoryModal(true);
    };

    const handleSaveCategory = async (data: { name: string; slug: string }) => {
        try {
            if (currentCategory) {
                await categoryService.updateCategory(currentCategory.id, data);
                showSuccess("Categoria atualizada com sucesso!");
            } else {
                await categoryService.createCategory(data);
                showSuccess("Categoria criada com sucesso!");
            }
            loadCategories();
        } catch (error: any) {
            alert(error.response?.data?.message || "Erro ao salvar categoria");
        }
    };

    const handleDeleteCategory = async () => {
        if (!categoryToDelete) return;

        try {
            await categoryService.deleteCategory(categoryToDelete);
            showSuccess("Categoria deletada com sucesso!");
            loadCategories();
            setDeleteConfirm(false);
            setCategoryToDelete(null);
        } catch (error: any) {
            alert(error.response?.data?.message || "Erro ao deletar categoria");
            setDeleteConfirm(false);
            setCategoryToDelete(null);
        }
    };

    const openDeleteConfirm = (categoryId: string) => {
        setCategoryToDelete(categoryId);
        setDeleteConfirm(true);
    };

    if (loading) {
        return (
            <Container>
                <PageHeader>
                    <h1>Categorias</h1>
                </PageHeader>
                <p>Carregando...</p>
            </Container>
        );
    }

    return (
        <Container>
            <PageHeader>
                <h1>Categorias</h1>
                <div>
                    <PrimaryButton onClick={handleOpenCreateModal}>
                        <FontAwesomeIcon icon={faPlus} /> Nova Categoria
                    </PrimaryButton>
                </div>
            </PageHeader>

            <table className="responsive-table">
                <thead className="head">
                    <tr>
                        <th>Nome</th>
                        <th>Slug</th>
                        <th>Produtos</th>
                        <th>Ações</th>
                    </tr>
                </thead>
                <tbody>
                    {categories.length === 0 ? (
                        <tr>
                            <td colSpan={4} style={{ textAlign: 'center', padding: '2rem' }}>
                                Nenhuma categoria cadastrada
                            </td>
                        </tr>
                    ) : (
                        categories.map(category => (
                            <tr key={category.id}>
                                <td data-label="Nome">{category.name}</td>
                                <td data-label="Slug">{category.slug}</td>
                                <td data-label="Produtos">
                                    {category._count?.products || 0}
                                </td>
                                <td className="table-icon">
                                    <button 
                                        className="edit-button" 
                                        onClick={() => handleOpenEditModal(category)}
                                        title="Editar categoria"
                                    >
                                        <FontAwesomeIcon icon={faPen} />
                                    </button>
                                    <button 
                                        className="del-button" 
                                        onClick={() => openDeleteConfirm(category.id)}
                                        title="Deletar categoria"
                                    >
                                        <FontAwesomeIcon icon={faTrash} />
                                    </button>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>

            <CategoryModal
                isOpen={categoryModal}
                onRequestClose={() => setCategoryModal(false)}
                onSave={handleSaveCategory}
                currentCategory={currentCategory}
            />

            <ConfirmPopUp
                isOpen={deleteConfirm}
                onRequestClose={() => setDeleteConfirm(false)}
                handleAction={handleDeleteCategory}
                actionLabel="Tem certeza que deseja deletar esta categoria?"
                label="Deletar Categoria"
            />
        </Container>
    );
}
