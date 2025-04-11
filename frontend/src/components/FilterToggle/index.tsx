import { Wrapper, Button } from './style'

type Props = {
    value: string
    onChange: (val: 'day' | 'week' | 'month' | 'year') => void
}

const options = [
    { key: 'day', label: 'Dia' },
    { key: 'week', label: 'Semana' },
    { key: 'month', label: 'Mês' },
    { key: 'year', label: 'Ano' },
]

export function FilterToggle({ value, onChange }: Props) {
    return (
        <Wrapper>
            {options.map((opt) => (
                <Button
                    key={opt.key}
                    active={value === opt.key}
                    onClick={() => onChange(opt.key as any)}
                >
                    {opt.label}
                </Button>
            ))}
        </Wrapper>
    )
}