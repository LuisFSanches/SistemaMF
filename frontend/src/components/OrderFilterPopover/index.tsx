import { useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilter } from "@fortawesome/free-solid-svg-icons";
import {
    Container,
    FilterButton,
    FilterCount,
    PopoverPanel,
    PanelContent,
    FieldGroup,
    PanelFooter,
    ClearButton,
    ApplyButton
} from "./style";

export interface IOrderFilters {
    clientName: string;
    orderCode: string;
    phoneNumber: string;
    productName: string;
}

export const EMPTY_ORDER_FILTERS: IOrderFilters = {
    clientName: '',
    orderCode: '',
    phoneNumber: '',
    productName: ''
};

interface OrderFilterPopoverProps {
    filters: IOrderFilters;
    onApply: (filters: IOrderFilters) => void;
    right: string;
}

export function OrderFilterPopover({ filters, onApply, right }: OrderFilterPopoverProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [draft, setDraft] = useState<IOrderFilters>(filters);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setDraft(filters);
    }, [filters]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isOpen]);

    const activeCount = Object.values(filters).filter(value => value.trim() !== '').length;

    const handleFieldChange = (field: keyof IOrderFilters, value: string) => {
        setDraft(prev => ({ ...prev, [field]: value }));
    };

    const handleApply = () => {
        onApply(draft);
        setIsOpen(false);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        handleApply();
    };

    const handleClear = () => {
        setDraft(EMPTY_ORDER_FILTERS);
        onApply(EMPTY_ORDER_FILTERS);
        setIsOpen(false);
    };

    return (
        <Container ref={containerRef}>
            <FilterButton active={activeCount > 0} onClick={() => setIsOpen(!isOpen)}>
                <FontAwesomeIcon icon={faFilter} />
                Filtros
                {activeCount > 0 && <FilterCount>{activeCount}</FilterCount>}
            </FilterButton>

            {isOpen && (
                <PopoverPanel style={{ right }}>
                    <PanelContent as="form" onSubmit={handleSubmit}>
                        <FieldGroup>
                            Cliente
                            <input
                                type="text"
                                placeholder="Nome do cliente"
                                value={draft.clientName}
                                onChange={(e) => handleFieldChange('clientName', e.target.value)}
                            />
                        </FieldGroup>

                        <FieldGroup>
                            Código do pedido
                            <input
                                type="text"
                                placeholder="Ex: 1234"
                                value={draft.orderCode}
                                onChange={(e) => handleFieldChange('orderCode', e.target.value)}
                            />
                        </FieldGroup>

                        <FieldGroup>
                            Telefone
                            <input
                                type="text"
                                placeholder="Telefone do cliente"
                                value={draft.phoneNumber}
                                onChange={(e) => handleFieldChange('phoneNumber', e.target.value.replace(/\D/g, ''))}
                            />
                        </FieldGroup>

                        <FieldGroup>
                            Produto
                            <input
                                type="text"
                                placeholder="Nome do produto"
                                value={draft.productName}
                                onChange={(e) => handleFieldChange('productName', e.target.value)}
                            />
                        </FieldGroup>

                        <PanelFooter>
                            <ClearButton type="button" onClick={handleClear}>
                                Limpar
                            </ClearButton>
                            <ApplyButton type="submit">
                                Aplicar
                            </ApplyButton>
                        </PanelFooter>
                    </PanelContent>
                </PopoverPanel>
            )}
        </Container>
    );
}
