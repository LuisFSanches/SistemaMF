import styled from 'styled-components'
import { Link } from 'react-router-dom'

export const Frame = styled.div`
    background: var(--dt-paper);
    border: 1px solid var(--dt-line);
    border-radius: 14px;
    box-shadow: 0 4px 16px rgba(60, 20, 30, 0.08);
    overflow: hidden;
`

export const Toolbar = styled.div`
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px 15px;
    flex-wrap: wrap;

    > .dt-spacer {
        flex: 1;
    }
`

export const SearchBox = styled.div`
    position: relative;
    flex: 1;
    min-width: 220px;
    max-width: 340px;

    svg {
        position: absolute;
        left: 12px;
        top: 50%;
        transform: translateY(-50%);
        opacity: 0.45;
        pointer-events: none;
    }

    input {
        width: 100%;
        font: inherit;
        font-size: 13.5px;
        padding: 9px 12px 9px 34px;
        border: 1px solid var(--dt-line-strong);
        border-radius: 10px;
        background: var(--dt-paper-sunk);
        color: var(--dt-ink);
        outline: none;
        transition: border-color 0.15s ease, box-shadow 0.15s ease;

        &:focus {
            border-color: var(--dt-accent);
            box-shadow: 0 0 0 3px var(--dt-accent-wash-strong);
            background: var(--dt-paper);
        }

        &::placeholder {
            color: var(--dt-ink-faint);
        }
    }
`

export const ScrollArea = styled.div`
    overflow-x: auto;
`

export const Table = styled.table`
    width: 100%;
    border-collapse: collapse;
    font-size: 13.5px;
    min-width: 100%;

    thead th {
        position: sticky;
        top: 0;
        z-index: 2;
        background: var(--dt-paper-sunk);
        text-align: center;
        font-size: 12.5px;
        font-weight: 700;
        letter-spacing: 0.05em;
        text-transform: uppercase;
        color: var(--dt-ink-faint);
        padding: 12px 16px;
        border-bottom: 1px solid var(--dt-line-strong);
        white-space: nowrap;

        &.dt-align-right {
            text-align: center;
        }

        &.dt-sortable {
            cursor: pointer;
            user-select: none;
        }

        .dt-sort-icon {
            margin-left: 4px;
            opacity: 0.4;
            transition: opacity 0.12s ease;
        }

        &:hover .dt-sort-icon {
            opacity: 0.9;
        }

        &.dt-sort-active .dt-sort-icon {
            opacity: 1;
            color: var(--dt-accent);
        }
    }

    tbody td {
        padding: 13px 16px;
        border-bottom: 1px solid var(--dt-line);
        color: var(--dt-ink);
        vertical-align: middle;

        &.dt-align-right {
            text-align: right;
            font-variant-numeric: tabular-nums;
            font-feature-settings: "tnum";
        }
    }

    tbody tr {
        transition: background-color 0.1s ease;
    }

    tbody tr:nth-child(even) td {
        background: var(--dt-paper-sunk);
    }

    tbody tr:hover td {
        background: var(--dt-accent-wash);
    }

    tbody tr:last-child td {
        border-bottom: none;
    }

    tbody tr.canceled-order td {
        background: var(--dt-bad-bg);
    }

    tbody tr.canceled-order:hover td {
        background: var(--dt-bad-bg);
        filter: brightness(0.97);
    }

    @media (max-width: 640px) {
        &.dt-responsive-cards {
            thead {
                display: none;
            }

            tbody, tr, td {
                display: block;
                width: 100% !important;
            }

            tbody tr {
                margin: 10px 12px;
                border: 1px solid var(--dt-line);
                border-radius: 10px;
                overflow: hidden;
            }

            tbody tr:nth-child(even) td {
                background: var(--dt-paper);
            }

            tbody tr:hover td {
                background: var(--dt-paper);
            }

            tbody td {
                display: flex;
                justify-content: space-between;
                gap: 12px;
                padding: 10px 14px;
                border-bottom: 1px solid var(--dt-line);
                text-align: right;

                &.dt-align-right {
                    text-align: right;
                }

                &::before {
                    content: attr(data-label);
                    font-weight: 600;
                    color: var(--dt-ink-faint);
                    text-transform: uppercase;
                    font-size: 10.5px;
                    letter-spacing: 0.04em;
                    text-align: left;
                }
            }

            tbody tr:last-child td {
                border-bottom: 1px solid var(--dt-line);
            }

            tbody tr td:last-child {
                border-bottom: none;
            }
        }
    }
`

export const RowActions = styled.div`
    display: flex;
    gap: 4px;
    justify-content: flex-end;
`

export type IconButtonTone = 'edit' | 'duplicate' | 'delete' | 'view' | 'default';

const toneColor: Record<IconButtonTone, string> = {
    edit: 'var(--dt-info-fg)',
    duplicate: '#c9820a',
    delete: 'var(--dt-bad-fg)',
    view: 'var(--dt-good-fg)',
    default: 'var(--dt-ink-faint)',
}

const toneHoverBg: Record<IconButtonTone, string> = {
    edit: 'var(--dt-info-bg)',
    duplicate: '#fdf1dc',
    delete: 'var(--dt-bad-bg)',
    view: 'var(--dt-good-bg)',
    default: 'var(--dt-accent-wash)',
}

export const IconButton = styled.button<{ $tone?: IconButtonTone; $danger?: boolean }>`
    width: 30px;
    height: 30px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border-radius: 6px;
    border: 1px solid transparent;
    background: transparent;
    color: ${({ $tone, $danger }) => toneColor[$danger ? 'delete' : ($tone ?? 'default')]};
    cursor: pointer;
    opacity: 0.85;
    transition: all 0.12s ease;

    &:hover {
        opacity: 1;
        background: ${({ $tone, $danger }) => toneHoverBg[$danger ? 'delete' : ($tone ?? 'default')]};
        border-color: var(--dt-line-strong);
    }
`

export const IconLinkButton = styled(Link)<{ $tone?: IconButtonTone }>`
    width: 30px;
    height: 30px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border-radius: 6px;
    border: 1px solid transparent;
    background: transparent;
    color: ${({ $tone }) => toneColor[$tone ?? 'default']};
    cursor: pointer;
    opacity: 0.85;
    transition: all 0.12s ease;

    &:hover {
        opacity: 1;
        background: ${({ $tone }) => toneHoverBg[$tone ?? 'default']};
        border-color: var(--dt-line-strong);
    }
`

export const Footer = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 5px 20px;
    border-top: 1px solid var(--dt-line);
    flex-wrap: wrap;
    gap: 12px;

    .dt-count {
        font-size: 16px;
        color: var(--dt-ink-faint);

        strong {
            color: var(--dt-ink-soft);
            font-weight: 600;
        }
    }
`

export const EmptyState = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    padding: 56px 24px;
    gap: 6px;

    .dt-empty-glyph {
        width: 44px;
        height: 44px;
        border-radius: 50%;
        background: var(--dt-accent-wash);
        display: flex;
        align-items: center;
        justify-content: center;
        color: var(--dt-accent);
        margin-bottom: 8px;
    }

    h4 {
        margin: 0;
        font-size: 15px;
        font-weight: 600;
        color: var(--dt-ink);
    }

    p {
        margin: 0;
        font-size: 13px;
        max-width: 34ch;
        color: var(--dt-ink-faint);
    }
`

export const SkeletonBar = styled.div`
    height: 13px;
    border-radius: 4px;
    background: linear-gradient(90deg, var(--dt-line) 25%, var(--dt-line-strong) 37%, var(--dt-line) 63%);
    background-size: 400% 100%;
    animation: dt-shimmer 1.4s ease infinite;

    @keyframes dt-shimmer {
        0% { background-position: 100% 0; }
        100% { background-position: -100% 0; }
    }

    @media (prefers-reduced-motion: reduce) {
        animation: none;
        opacity: 0.6;
    }
`
