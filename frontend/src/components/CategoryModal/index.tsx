import { useEffect, useState, useRef } from "react";
import Modal from 'react-modal';
import { useForm } from "react-hook-form";
import { ModalContainer, Form, Input, Label, ErrorMessage, PrimaryButton } from '../../styles/global';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXmark, faImage, faTrash } from "@fortawesome/free-solid-svg-icons";
import { ICategory } from "../../interfaces/ICategory";
import categoryService from "../../services/categoryService";
import { ImageUploadContainer, ImagePreviewContainer, ImagePreview, RemoveImageButton, UploadPlaceholder, HiddenFileInput } from './style';

interface CategoryModalProps {
    isOpen: boolean;
    onRequestClose: () => void;
    onSave: (data: { name: string; slug: string }) => Promise<void>;
    currentCategory?: ICategory | null;
    onImageUpdate?: () => Promise<void>;
}

interface ICategoryForm {
    name: string;
    slug: string;
}

export function CategoryModal({
    isOpen,
    onRequestClose,
    onSave,
    currentCategory,
    onImageUpdate
}: CategoryModalProps) {
    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors },
        reset
    } = useForm<ICategoryForm>();

    const nameValue = watch("name");

    // Estados para gerenciar imagem
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string>("");
    const [isUploadingImage, setIsUploadingImage] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (currentCategory) {
            setValue("name", currentCategory.name);
            setValue("slug", currentCategory.slug);
            if (currentCategory.image) {
                setImagePreview(currentCategory.image);
            } else {
                setImagePreview("");
            }
        } else {
            reset();
            setImagePreview("");
        }
        setImageFile(null);
    }, [currentCategory, setValue, reset]);

    // Auto-gerar slug ao digitar o nome
    useEffect(() => {
        if (nameValue && !currentCategory) {
            const slug = nameValue
                .toLowerCase()
                .normalize('NFD')
                .replace(/[\u0300-\u036f]/g, '')
                .replace(/[^a-z0-9\s-]/g, '')
                .trim()
                .replace(/\s+/g, '-')
                .replace(/-+/g, '-');
            setValue("slug", slug);
        }
    }, [nameValue, currentCategory, setValue]);

    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            if (file.size > 500 * 1024) {
                alert("A imagem deve ter no máximo 500KB. Escolha outra imagem por favor.");
                return;
            }

            const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
            if (!validTypes.includes(file.type)) {
                alert("Formato inválido. Use JPEG, JPG, PNG ou WEBP.");
                return;
            }

            setImageFile(file);
            
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleRemoveImage = async () => {
        if (currentCategory?.id && currentCategory.image) {
            // Se já existe imagem salva no backend, deletar
            if (window.confirm("Deseja remover a imagem desta categoria?")) {
                try {
                    setIsUploadingImage(true);
                    await categoryService.deleteCategoryImage(currentCategory.id);
                    setImagePreview("");
                    setImageFile(null);
                    if (fileInputRef.current) {
                        fileInputRef.current.value = "";
                    }
                    if (onImageUpdate) {
                        await onImageUpdate();
                    }
                    alert("Imagem removida com sucesso!");
                } catch (error) {
                    alert("Erro ao remover imagem");
                    console.error(error);
                } finally {
                    setIsUploadingImage(false);
                }
            }
        } else {
            // Se é apenas preview local, apenas limpar
            setImagePreview("");
            setImageFile(null);
            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }
        }
    };

    const handleCategory = async (formData: ICategoryForm) => {
        try {
            await onSave(formData);
            
            // Se houver imagem para upload e a categoria foi editada
            if (imageFile && currentCategory?.id) {
                setIsUploadingImage(true);
                try {
                    await categoryService.uploadCategoryImage(currentCategory.id, imageFile);
                    if (onImageUpdate) {
                        await onImageUpdate();
                    }
                } catch (error) {
                    console.error("Erro ao fazer upload da imagem:", error);
                    alert("Categoria salva, mas houve erro no upload da imagem");
                } finally {
                    setIsUploadingImage(false);
                }
            }
            
            reset();
            setImageFile(null);
            setImagePreview("");
            onRequestClose();
        } catch (error) {
            console.error("Erro ao salvar categoria:", error);
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onRequestClose}
            overlayClassName="react-modal-overlay"
            className="react-modal-content"
        >
            <button
                type="button"
                onClick={onRequestClose}
                className="modal-close"
            >
                <FontAwesomeIcon icon={faXmark} />
            </button>

            <ModalContainer>
                <h2>{currentCategory ? 'Editar Categoria' : 'Nova Categoria'}</h2>
                <Form onSubmit={handleSubmit(handleCategory)}>
                    <Label>
                        Nome da Categoria *
                        <Input
                            type="text"
                            placeholder="Ex: Flores, Cestas, Plantas"
                            {...register("name", {
                                required: "Nome da categoria é obrigatório"
                            })}
                        />
                        {errors.name && <ErrorMessage>{errors.name.message}</ErrorMessage>}
                    </Label>

                    <Label>
                        Slug (URL) *
                        <Input
                            type="text"
                            placeholder="Ex: flores, cestas, plantas"
                            {...register("slug", {
                                required: "Slug é obrigatório",
                                pattern: {
                                    value: /^[a-z0-9-]+$/,
                                    message: "Slug deve conter apenas letras minúsculas, números e hífens"
                                }
                            })}
                        />
                        {errors.slug && <ErrorMessage>{errors.slug.message}</ErrorMessage>}
                    </Label>

                    <Label>
                        Imagem da Categoria (opcional)
                        <ImageUploadContainer>
                            <HiddenFileInput
                                ref={fileInputRef}
                                type="file"
                                accept="image/jpeg,image/jpg,image/png,image/webp"
                                onChange={handleImageChange}
                                disabled={isUploadingImage}
                            />
                            {imagePreview ? (
                                <ImagePreviewContainer>
                                    <ImagePreview src={imagePreview} alt="Preview da categoria" />
                                    <RemoveImageButton
                                        type="button"
                                        onClick={handleRemoveImage}
                                        disabled={isUploadingImage}
                                    >
                                        <FontAwesomeIcon icon={faTrash} />
                                        {isUploadingImage ? "Removendo..." : "Remover"}
                                    </RemoveImageButton>
                                </ImagePreviewContainer>
                            ) : (
                                <UploadPlaceholder
                                    type="button"
                                    onClick={() => fileInputRef.current?.click()}
                                    disabled={isUploadingImage}
                                >
                                    <FontAwesomeIcon icon={faImage} size="2x" />
                                    <span>Clique para adicionar imagem</span>
                                    <small>Máximo 500KB - JPEG, JPG, PNG ou WEBP</small>
                                </UploadPlaceholder>
                            )}
                        </ImageUploadContainer>
                    </Label>

                    <PrimaryButton type="submit" style={{ marginTop: '20px' }} disabled={isUploadingImage}>
                        {isUploadingImage ? "Salvando..." : currentCategory ? 'Atualizar' : 'Criar'} Categoria
                    </PrimaryButton>
                </Form>
            </ModalContainer>
        </Modal>
    );
}
