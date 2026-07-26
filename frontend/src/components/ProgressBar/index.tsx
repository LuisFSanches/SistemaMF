import { Wrap, Track, Fill, Text } from './style';

interface ProgressBarProps {
    value: number;
    max: number;
}

export function ProgressBar({ value, max }: ProgressBarProps) {
    const percent = max > 0 ? Math.min(100, (value / max) * 100) : 0;
    const isFull = max > 0 && value >= max;

    return (
        <Wrap>
            <Track>
                <Fill $percent={percent} $danger={isFull} />
            </Track>
            <Text>{value}/{max}</Text>
        </Wrap>
    );
}
