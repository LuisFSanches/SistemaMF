import styled from "styled-components";

export const Container = styled.div``;

export const HiddenFileInput = styled.input`
    display: none;
`;

export const ImageUploadContainer = styled.div`
    margin-top: 10px;
    width: 100%;
`;

export const ImagePreviewContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 15px;
    padding: 20px;
    border: 2px dashed var(--border-color);
    border-radius: 8px;
    background: var(--background-light);
`;

export const ImagePreview = styled.img`
    max-width: 100%;
    max-height: 300px;
    object-fit: contain;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

export const RemoveImageButton = styled.button`
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 10px 20px;
    background: var(--red);
    color: white;
    border: none;
    border-radius: 6px;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;

    &:hover:not(:disabled) {
        background: #c0392b;
        transform: translateY(-1px);
    }

    &:disabled {
        opacity: 0.6;
        cursor: not-allowed;
    }
`;

export const UploadPlaceholder = styled.button`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 10px;
    width: 100%;
    min-height: 200px;
    padding: 30px;
    background: var(--background-light);
    border: 2px dashed var(--border-color);
    border-radius: 8px;
    color: var(--text-body);
    cursor: pointer;
    transition: all 0.3s;

    &:hover:not(:disabled) {
        border-color: var(--primary-color);
        background: rgba(90, 46, 224, 0.05);
        color: var(--primary-color);
    }

    &:disabled {
        opacity: 0.6;
        cursor: not-allowed;
    }

    svg {
        color: var(--text-body);
    }

    &:hover:not(:disabled) svg {
        color: var(--primary-color);
    }

    span {
        font-size: 16px;
        font-weight: 500;
    }

    small {
        font-size: 12px;
        color: var(--text-muted);
    }
`;

