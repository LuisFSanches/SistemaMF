import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Card, CardHeader, IconWrapper, Title, Value } from './style';

interface SummaryCardProps {
    title: string;
    value: string | number;
    icon?: any;
    color?: string;
}

export function SummaryCard({ title, value, icon, color = '#8b5cf6' }: SummaryCardProps) {
    return (
        <Card color={color}>
            <CardHeader>
                {icon && (
                    <IconWrapper color={color}>
                        <FontAwesomeIcon icon={icon} />
                    </IconWrapper>
                )}
                <Title>{title}</Title>
            </CardHeader>
            <Value>{value}</Value>
        </Card>
    )
}
