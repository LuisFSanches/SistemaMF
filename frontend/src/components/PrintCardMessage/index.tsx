import { GenerateCard } from '../GenerateCard';

interface PrintCardMessageProps {
    card_message: string;
    card_from: string;
    card_to: string;
    order_code: string;
    isOpen: boolean;
    onRequestClose: () => void;
}

export const PrintCardMessage = ({ 
    card_message, 
    card_from, 
    card_to, 
    order_code,
    isOpen,
    onRequestClose 
}: PrintCardMessageProps) => {
    return (
        <GenerateCard
            isOpen={isOpen}
            onRequestClose={onRequestClose}
            initialCardFrom={card_from}
            initialCardTo={card_to}
            initialCardMessage={card_message}
            initialOrderCode={order_code}
            readOnly={true}
            elementId="card-to-print-order"
            showButton={false}
        />
    );
};
