import styled from 'styled-components';

export const ImageUploadContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: 1rem;
    margin: 1rem 0;
`;

export const ImagePreviewBox = styled.div`
    width: 100%;
    min-height: 150px;
    border: 2px dashed var(--primary-color);
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    background: var(--white-background);
    overflow: hidden;

    img {
        max-width: 100%;
        max-height: 200px;
        object-fit: contain;
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

export const ImageActions = styled.div`
    display: flex;
    gap: 0.5rem;
    justify-content: center;
    margin-top: 0.5rem;
`;

export const ImageActionButton = styled.button`
    padding: 0.5rem 1rem;
    border: none;
    border-radius: 4px;
    font-size: 0.875rem;
    font-weight: 600;
    cursor: pointer;
    transition: filter 0.2s;

    &:hover {
        filter: brightness(0.9);
    }

    &.remove {
        background: var(--red);
        color: var(--text-white);
    }

    &.change {
        background: var(--blue);
        color: var(--text-white);
    }
`;

export const ImageInfo = styled.div`
    font-size: 0.75rem;
    color: var(--text-light);
    text-align: center;
    margin-top: 0.5rem;
`;
