import { Card, Title, Value } from './style';

export function SummaryCard({ title, value }: { title: string, value: string | number }) {
    return (
        <Card>
            <Title>{title}</Title>
            <Value>{value}</Value>
        </Card>
    )
}
