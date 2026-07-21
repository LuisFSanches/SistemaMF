import { useEffect } from "react";
import { useSuppliers } from "../../contexts/SuppliersContext";
import { StyledSelect } from "./style";

interface ISupplierSelectProps {
    value: string;
    onChange: (supplierId: string) => void;
    allLabel?: string;
    className?: string;
    style?: React.CSSProperties;
}

export function SupplierSelect({ value, onChange, allLabel = "Todos os Fornecedores", className, style }: ISupplierSelectProps) {
    const { suppliers, hasLoaded, loadSuppliers } = useSuppliers();

    useEffect(() => {
        if (!hasLoaded) {
            loadSuppliers();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [hasLoaded]);

    return (
        <StyledSelect
            className={className}
            style={style}
            value={value}
            onChange={(e) => onChange(e.target.value)}
        >
            <option value="">📦 {allLabel}</option>
            {suppliers.map((supplier) => (
                <option key={supplier.id} value={supplier.id}>
                    📦 {supplier.name}
                </option>
            ))}
        </StyledSelect>
    );
}
