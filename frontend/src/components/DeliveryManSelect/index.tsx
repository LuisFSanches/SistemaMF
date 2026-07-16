import { useEffect } from "react";
import { useDeliveryMen } from "../../contexts/DeliveryMenContext";
import { StyledSelect } from "./style";

interface IDeliveryManSelectProps {
    value: string;
    onChange: (deliveryManId: string) => void;
    allLabel?: string;
    className?: string;
}

export function DeliveryManSelect({ value, onChange, allLabel = "Todos os Motoboys", className }: IDeliveryManSelectProps) {
    const { deliveryMen, hasLoaded, loadDeliveryMen } = useDeliveryMen();

    useEffect(() => {
        if (!hasLoaded) {
            loadDeliveryMen();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [hasLoaded]);

    return (
        <StyledSelect
            className={className}
            value={value}
            onChange={(e) => onChange(e.target.value)}
        >
            <option value="">🛵 {allLabel}</option>
            {deliveryMen.map((deliveryMan) => (
                <option key={deliveryMan.id} value={deliveryMan.id}>
                    🛵 {deliveryMan.name}
                </option>
            ))}
        </StyledSelect>
    );
}
