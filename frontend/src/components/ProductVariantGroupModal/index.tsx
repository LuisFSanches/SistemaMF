import { useEffect, useState } from "react";
import Modal from "react-modal";
import { useForm, useFieldArray } from "react-hook-form";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark, faTrash } from "@fortawesome/free-solid-svg-icons";
import { ModalContainer, Form, Input, Label, Select, ErrorMessage, PrimaryButton, Textarea } from "../../styles/global";
import { IProductColor, IProductVariantGroup } from "../../interfaces/IProductVariant";
import { listProducts } from "../../services/productService";
import {
    createProductVariantGroup,
    updateProductVariantGroup,
    setProductVariants
} from "../../services/productVariantService";
import placeholder_products from "../../assets/images/placeholder_products.png";
import {
    SectionTitle,
    Hint,
    VariantList,
    VariantRow,
    IconButton,
    SearchRow,
    SearchResults,
    SearchResult,
    EmptyVariants
} from "./style";

interface ProductVariantGroupModalProps {
    isOpen: boolean;
    onRequestClose: () => void;
    onSaved: () => Promise<void>;
    currentGroup?: IProductVariantGroup | null;
    colors: IProductColor[];
}

interface IVariantFormItem {
    product_id: string;
    product_name: string;
    product_image: string | null;
    color_id: string;
}

interface IProductVariantGroupForm {
    name: string;
    description: string;
    variants: IVariantFormItem[];
}

export function ProductVariantGroupModal({
    isOpen,
    onRequestClose,
    onSaved,
    currentGroup,
    colors
}: ProductVariantGroupModalProps) {
    const { register, control, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<IProductVariantGroupForm>();
    const { fields, append, remove } = useFieldArray({ control, name: "variants" });

    const [productQuery, setProductQuery] = useState("");
    const [searchResults, setSearchResults] = useState<any[]>([]);
    const [searching, setSearching] = useState(false);

    useEffect(() => {
        if (isOpen) {
            reset({
                name: currentGroup?.name || "",
                description: currentGroup?.description || "",
                variants: (currentGroup?.products || []).map(product => ({
                    product_id: product.id,
                    product_name: product.name,
                    product_image: product.image,
                    color_id: product.color?.id || "",
                })),
            });
            setProductQuery("");
            setSearchResults([]);
        }
    }, [isOpen, currentGroup, reset]);

    const handleSearchProducts = async () => {
        if (!productQuery.trim()) return;

        try {
            setSearching(true);
            const { data } = await listProducts(1, 15, encodeURIComponent(productQuery.trim()));
            setSearchResults(data.products || []);
        } catch (error) {
            console.error("Erro ao buscar produtos:", error);
        } finally {
            setSearching(false);
        }
    };

    const handleAddProduct = (product: any) => {
        append({
            product_id: product.id,
            product_name: product.name,
            product_image: product.image || null,
            color_id: "",
        });
    };

    const handleSave = async (data: IProductVariantGroupForm) => {
        if (data.variants.length < 2) {
            alert("Adicione pelo menos 2 produtos (cores) ao grupo.");
            return;
        }

        const colorIds = data.variants.map(variant => variant.color_id);
        if (new Set(colorIds).size !== colorIds.length) {
            alert("Cada cor só pode ser usada uma vez no grupo.");
            return;
        }

        const variants = data.variants.map((variant, index) => ({
            product_id: variant.product_id,
            color_id: variant.color_id,
            variant_order: index,
        }));

        try {
            if (currentGroup) {
                await updateProductVariantGroup(currentGroup.id, { name: data.name, description: data.description || null });
                await setProductVariants(currentGroup.id, variants);
            } else {
                await createProductVariantGroup({ name: data.name, description: data.description || null, variants });
            }

            await onSaved();
            onRequestClose();
        } catch (error: any) {
            console.error("Erro ao salvar grupo de variações:", error);
            alert(error.response?.data?.message || "Erro ao salvar o grupo de variações.");
        }
    };

    const addedProductIds = new Set(fields.map(field => field.product_id));

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onRequestClose}
            overlayClassName="react-modal-overlay"
            className="react-modal-content"
        >
            <button type="button" onClick={onRequestClose} className="modal-close">
                <FontAwesomeIcon icon={faXmark} />
            </button>

            <ModalContainer>
                <h2>{currentGroup ? "Editar Grupo de Cores" : "Novo Grupo de Cores"}</h2>
                <Form onSubmit={handleSubmit(handleSave)}>
                    <Label>
                        Nome do grupo *
                        <Input
                            type="text"
                            placeholder="Ex: Buquê de 6 Rosas"
                            {...register("name", { required: "Nome do grupo é obrigatório" })}
                        />
                        {errors.name && <ErrorMessage>{errors.name.message}</ErrorMessage>}
                    </Label>

                    <Label>
                        Descrição (opcional)
                        <Textarea rows={2} {...register("description")} />
                    </Label>

                    <SectionTitle>Cores do grupo</SectionTitle>
                    <Hint>
                        Cada cor continua sendo um produto separado (preço, estoque e QR code próprios).
                        A ordem abaixo é a ordem em que as cores aparecem para o cliente.
                    </Hint>

                    <VariantList>
                        {fields.length === 0 && (
                            <EmptyVariants>Nenhum produto adicionado. Busque abaixo para adicionar.</EmptyVariants>
                        )}
                        {fields.map((field, index) => (
                            <VariantRow key={field.id}>
                                <img src={field.product_image || placeholder_products} alt={field.product_name} />
                                <span>{field.product_name}</span>
                                <Select
                                    {...register(`variants.${index}.color_id` as const, { required: true })}
                                    aria-label={`Cor de ${field.product_name}`}
                                >
                                    <option value="">Selecione a cor</option>
                                    {colors.map(color => (
                                        <option key={color.id} value={color.id}>{color.name}</option>
                                    ))}
                                </Select>
                                <IconButton type="button" onClick={() => remove(index)} title="Remover do grupo">
                                    <FontAwesomeIcon icon={faTrash} />
                                </IconButton>
                            </VariantRow>
                        ))}
                    </VariantList>
                    {errors.variants && <ErrorMessage>Selecione a cor de todos os produtos.</ErrorMessage>}

                    <SectionTitle>Adicionar produto</SectionTitle>
                    <SearchRow>
                        <Input
                            type="text"
                            placeholder="Buscar no catálogo geral..."
                            value={productQuery}
                            onChange={(e) => setProductQuery(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    e.preventDefault();
                                    handleSearchProducts();
                                }
                            }}
                        />
                        <button type="button" onClick={handleSearchProducts} disabled={searching}>
                            {searching ? "..." : "Buscar"}
                        </button>
                    </SearchRow>
                    <SearchResults>
                        {searchResults.map(product => {
                            const inThisGroup = addedProductIds.has(product.id);
                            const inOtherGroup = !!product.variant_group_id && product.variant_group_id !== currentGroup?.id && !inThisGroup;

                            return (
                                <SearchResult
                                    key={product.id}
                                    type="button"
                                    disabled={inThisGroup || inOtherGroup}
                                    onClick={() => handleAddProduct(product)}
                                >
                                    {product.name}
                                    <small>
                                        {inThisGroup ? "Adicionado" : inOtherGroup ? "Já está em outro grupo" : "+ Adicionar"}
                                    </small>
                                </SearchResult>
                            );
                        })}
                    </SearchResults>

                    <PrimaryButton type="submit" disabled={isSubmitting}>
                        {isSubmitting ? "Salvando..." : currentGroup ? "Atualizar Grupo" : "Criar Grupo"}
                    </PrimaryButton>
                </Form>
            </ModalContainer>
        </Modal>
    );
}
