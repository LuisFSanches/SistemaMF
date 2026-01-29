import styled from 'styled-components';

export const ImageUploadContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: 1rem;
    margin: 1rem 0;
`;

export const SwitchActions = styled.div`
    display: flex;
    justify-content: space-between;
    margin: 0 0 10px 0;
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

export const QRCodeContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
    padding: 1.5rem;
    background: #f8f9fa;
    border-radius: 8px;
    margin: 1rem 0;
`;

export const QRCodeTitle = styled.h3`
    font-size: 1rem;
    font-weight: 600;
    color: var(--text-title);
    margin: 0;
    display: flex;
    align-items: center;
    gap: 0.5rem;

    svg {
        color: var(--primary-color);
    }
`;

export const QRCodeImageBox = styled.div`
    background: white;
    padding: 1rem;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    display: flex;
    align-items: center;
    justify-content: center;

    img {
        max-width: 200px;
        max-height: 200px;
        width: 100%;
        height: auto;
        display: block;
    }
`;

export const QRCodeActions = styled.div`
    display: flex;
    gap: 0.5rem;
    flex-wrap: wrap;
    justify-content: center;
`;

export const QRCodeButton = styled.button`
    padding: 0.6rem 1.2rem;
    border: none;
    border-radius: 6px;
    font-size: 0.875rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
    display: flex;
    align-items: center;
    gap: 0.5rem;

    &:hover {
        filter: brightness(0.9);
        transform: translateY(-1px);
    }

    &.print {
        background: var(--primary-color);
        color: white;
    }

    &.download {
        background: var(--blue);
        color: white;
    }

    svg {
        font-size: 1rem;
    }
`;

export const QRCodeInfo = styled.p`
    font-size: 0.75rem;
    color: var(--text-light);
    text-align: center;
    margin: 0;
`;

export const SearchContainer = styled.div`
    position: relative;

    svg {
        position: absolute;
        left: 1rem;
        top: 46%;
        transform: translateY(-50%);
        color: var(--text-light);
        font-size: 1rem;
    }
`;

export const SearchInput = styled.input`
    width: 100%;
    padding-left: 2.5rem !important;
    border: 2px solid var(--border-color);
    border-radius: 8px;
    font-size: 1rem;
    transition: border-color 0.2s;

    &:focus {
        outline: none;
        border-color: var(--primary-color);
    }

    &::placeholder {
        color: var(--text-light);
    }
`;

export const SearchResults = styled.div`
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    max-height: 400px;
    overflow-y: auto;
    margin-top: 1rem;
    padding: 0.5rem;
`;

export const ProductSearchItem = styled.div`
    display: flex;
    gap: 1rem;
    padding: 1rem;
    background: var(--white-background);
    border: 2px solid var(--border-color);
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.2s;

    &:hover {
        border-color: var(--primary-color);
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }
`;

export const ProductSearchImage = styled.div`
    width: 80px;
    height: 80px;
    border-radius: 8px;
    overflow: hidden;
    background: #f0f0f0;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;

    img {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }

    span {
        font-size: 0.75rem;
        color: var(--text-light);
        text-align: center;
    }
`;

export const ProductSearchInfo = styled.div`
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;

    h3 {
        margin: 0 0 0.5rem 0;
        font-size: 1rem;
        font-weight: 600;
        color: var(--text-title);
    }

    p {
        margin: 0;
        font-size: 0.875rem;
        color: var(--text-light);
    }
`;

export const NoResultsMessage = styled.div`
    padding: 2rem;
    text-align: center;
    color: var(--text-body);
    background: #fff3cd;
    border: 1px solid #ffc107;
    border-radius: 8px;
    margin: 1rem 0;
    line-height: 1.6;

    strong {
        color: var(--text-title);
        display: block;
        margin-top: 0.5rem;
    }
`;

export const CreateNewProductButton = styled.button`
    width: 100%;
    padding: 1rem;
    background: #EC4899;
    color: white;
    border: none;
    border-radius: 8px;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    transition: all 0.2s;

    &:hover {
        filter: brightness(0.9);
        transform: translateY(-2px);
    }

    svg {
        font-size: 1.2rem;
    }
`;

export const ValidationWarning = styled.div`
    padding: 0.75rem 1rem;
    text-align: center;
    color: var(--red);
    background: #ffe5e5;
    border: 1px solid var(--red);
    border-radius: 8px;
    margin: 0.5rem 0 1rem 0;
    font-size: 0.875rem;
    font-weight: 500;
`;
