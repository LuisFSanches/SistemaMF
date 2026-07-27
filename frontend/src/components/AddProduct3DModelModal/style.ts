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

export const SelectedProductBox = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    background: var(--background);
    padding: 0.75rem 1rem;
    border-radius: 8px;
    margin-bottom: 1rem;

    img {
        width: 40px;
        height: 40px;
        object-fit: contain;
        border-radius: 4px;
        background: var(--white-background);
    }

    div.info {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        flex: 1;
    }

    h3 {
        font-size: 0.95rem;
        color: var(--text-title);
        margin: 0;
    }

    button {
        background: transparent;
        border: 1px solid var(--primary-color);
        color: var(--primary-color);
        border-radius: 4px;
        padding: 0.35rem 0.75rem;
        font-size: 0.8rem;
        cursor: pointer;
    }
`;
