import { ReactNode } from 'react';
import { StyledBadge, BadgeTone } from './style';

export type { BadgeTone };

interface BadgeProps {
    tone: BadgeTone;
    children: ReactNode;
}

export function Badge({ tone, children }: BadgeProps) {
    return <StyledBadge $tone={tone}>{children}</StyledBadge>;
}
