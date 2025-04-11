import styled from 'styled-components'

export const Wrapper = styled.div`
    display: flex;
    gap: 8px;
`

export const Button = styled.button<{ active: boolean }>`
    padding: 8px 16px;
    border: none;
    background: ${({ active }) => (active ? '#e7b7c2' : '#eee')};
    color: ${({ active }) => (active ? '#fff' : '#333')};
    font-weight: bold;
    border-radius: 8px;
    cursor: pointer;
`