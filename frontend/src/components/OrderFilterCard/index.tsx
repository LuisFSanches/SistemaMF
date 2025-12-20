import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { Card, CardHeader, CardTitle, CardValue, IconWrapper } from './style';

interface OrderFilterCardProps {
    title: string;
    value: number;
    icon: IconDefinition;
    color: string;
    isActive: boolean;
    onClick: () => void;
}

export function OrderFilterCard({ title, value, icon, color, isActive, onClick }: OrderFilterCardProps) {
    return (
        <Card color={color} isActive={isActive} onClick={onClick}>
            <CardHeader>
                <CardTitle>{title}</CardTitle>
                <IconWrapper color={color}>
                    <FontAwesomeIcon icon={icon} />
                </IconWrapper>
            </CardHeader>
            <CardValue>{value}</CardValue>
        </Card>
    );
}
