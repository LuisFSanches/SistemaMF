import styled from 'styled-components';

export const PreviewBox = styled.div`
    width: 100%;
    height: 260px;
    border: 2px dashed var(--primary-color);
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    background: var(--white-background);
    overflow: hidden;
    margin: 1rem 0;

    model-viewer {
        width: 100%;
        height: 100%;
    }
`;

export const UploadLabel = styled.label`
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
    cursor: pointer;
    padding: 1rem;
    color: var(--text-title);
    transition: all 0.2s;

    &:hover {
        color: var(--primary-color);
    }

    svg {
        font-size: 2rem;
    }

    span {
        font-size: 0.875rem;
        text-align: center;
    }
`;

export const HiddenFileInput = styled.input`
    display: none;
`;

export const FileInfo = styled.div`
    font-size: 0.8rem;
    color: var(--text-light);
    text-align: center;
    margin-top: 0.5rem;
`;

export const ProductInfoBox = styled.div`
    display: flex;
    align-items: center;
    gap: 1rem;
    background: var(--background);
    padding: 0.75rem 1rem;
    border-radius: 8px;
    margin-bottom: 1rem;

    img {
        width: 48px;
        height: 48px;
        object-fit: contain;
        border-radius: 4px;
        background: var(--white-background);
    }

    h3 {
        font-size: 1rem;
        color: var(--text-title);
        margin: 0;
    }
`;
