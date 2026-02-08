import styled from 'styled-components';

export const Container = styled.div`
    width: 100%;
    padding: 2rem;

    @media (max-width: 768px) {
        padding: 1rem;
    }
`;

export const Header = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;

    h1 {
        font-size: 28px;
        color: var(--text-title);
        font-weight: 700;
    }

    @media (max-width: 768px) {
        flex-direction: column;
        align-items: flex-start;
        gap: 1rem;

        h1 {
            font-size: 24px;
        }
    }
`;

export const TabsContainer = styled.div`
    display: flex;
    gap: 0.5rem;
    margin-bottom: 2rem;
    border-bottom: 2px solid #e7b7c2;
    overflow-x: auto;

    @media (max-width: 768px) {
        gap: 0.3rem;
    }
`;

export const Tab = styled.button<{ $active: boolean }>`
    padding: 1rem 1.5rem;
    background: ${({ $active }) => ($active ? '#EC4899' : 'transparent')};
    border: none;
    border-bottom: 3px solid ${({ $active }) => ($active ? '#EC4899' : 'transparent')};
    color: ${({ $active }) => ($active ? '#fff' : 'var(--text-title)')};
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    white-space: nowrap;
    border-radius: 8px 8px 0 0;

    &:hover {
        background: ${({ $active }) => ($active ? '#EC4899' : '#f5f5f5')};
    }

    @media (max-width: 768px) {
        padding: 0.75rem 1rem;
        font-size: 14px;
    }
`;

export const TabContent = styled.div`
    background: var(--white-background);
    border-radius: 8px;
    padding: 1rem;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

    @media (max-width: 768px) {
        padding: 1rem;
    }
`;

export const MediaSection = styled.div`
    display: flex;
    flex-direction: column;
    gap: 2rem;
`;

export const ImageUploadArea = styled.div`
    display: flex;
    flex-direction: column;
    gap: 1rem;

    h3 {
        font-size: 18px;
        color: var(--text-title);
        font-weight: 600;
    }

    @media (max-width: 768px) {
        h3 {
            font-size: 16px;
        }
    }
`;

export const ImagePreview = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
    padding: 1.5rem;
    border: 2px dashed #e7b7c2;
    border-radius: 8px;
    background: #fafafa;
`;

export const AvatarPreview = styled.div`
    width: 150px;
    height: 150px;
    border-radius: 50%;
    overflow: hidden;
    border: 3px solid #EC4899;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--light-background);

    img {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }

    svg {
        font-size: 60px;
        color: #ccc;
    }

    @media (max-width: 768px) {
        width: 120px;
        height: 120px;
        
        svg {
            font-size: 50px;
        }
    }
`;

export const BannerPreview = styled.div`
    width: 100%;
    max-width: 800px;
    height: 200px;
    border-radius: 8px;
    overflow: hidden;
    border: 3px solid #EC4899;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--light-background);

    img {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }

    svg {
        font-size: 80px;
        color: #ccc;
    }

    @media (max-width: 768px) {
        height: 150px;
        
        svg {
            font-size: 60px;
        }
    }
`;

export const FileInputLabel = styled.label`
    padding: 0.75rem 1.5rem;
    background: #EC4899;
    color: #fff;
    border-radius: 8px;
    cursor: pointer;
    font-weight: 600;
    transition: all 0.3s;

    &:hover {
        background: #d48a9b;
        transform: translateY(-2px);
    }

    input {
        display: none;
    }
`;

export const ScheduleGrid = styled.div`
    display: flex;
    flex-direction: column;
    gap: 1rem;
`;

export const DayScheduleCard = styled.div`
    background: #fafafa;
    padding: 1.5rem;
    border-radius: 8px;
    border: 1px solid #e7b7c2;

    h4 {
        font-size: 16px;
        color: var(--text-title);
        margin-bottom: 1rem;
        font-weight: 600;
    }

    @media (max-width: 768px) {
        padding: 1rem;
        
        h4 {
            font-size: 14px;
        }
    }
`;

export const ScheduleInputsRow = styled.div`
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
    margin-top: 1rem;

    @media (max-width: 768px) {
        grid-template-columns: 1fr;
    }
`;

export const TimeInputGroup = styled.div`
    display: flex;
    flex-direction: column;
    gap: 0.5rem;

    label {
        font-size: 14px;
        color: #666;
        font-weight: 500;
    }

    input {
        padding: 0.75rem;
        border: 1px solid #e7b7c2;
        border-radius: 6px;
        font-size: 14px;

        &:disabled {
            background: #f0f0f0;
            cursor: not-allowed;
        }
    }
`;

export const PaymentMethodCard = styled.div`
    background: #fafafa;
    padding: 1.5rem;
    border-radius: 8px;
    border: 1px solid #e7b7c2;
    margin-bottom: 1.5rem;

    h3 {
        font-size: 18px;
        color: var(--text-title);
        margin-bottom: 1rem;
        font-weight: 600;
        display: flex;
        align-items: center;
        gap: 0.5rem;

        svg {
            color: #EC4899;
        }
    }

    @media (max-width: 768px) {
        padding: 1rem;
        
        h3 {
            font-size: 16px;
        }
    }
`;

export const FormGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;

    @media (max-width: 768px) {
        grid-template-columns: 1fr;
    }
`;

export const ButtonGroup = styled.div`
    display: flex;
    gap: 1rem;
    margin-top: 1.5rem;
    justify-content: flex-end;

    @media (max-width: 768px) {
        flex-direction: column;
        gap: 0.5rem;
    }
`;

export const SaveButton = styled.button`
    padding: 0.75rem 2rem;
    background: var(--green);
    color: #fff;
    border: none;
    border-radius: 8px;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s;

    &:hover {
        filter: brightness(1.1);
        transform: translateY(-2px);
    }

    &:disabled {
        background: #ccc;
        cursor: not-allowed;
        transform: none;
    }

    @media (max-width: 768px) {
        width: 100%;
    }
`;

export const CancelButton = styled.button`
    padding: 0.75rem 2rem;
    background: transparent;
    color: var(--text-title);
    border: 2px solid #e7b7c2;
    border-radius: 8px;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s;

    &:hover {
        background: #f5f5f5;
        transform: translateY(-2px);
    }

    @media (max-width: 768px) {
        width: 100%;
    }
`;

export const LoadingContainer = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 3rem;
    color: var(--text-title);
    font-size: 18px;
`;
