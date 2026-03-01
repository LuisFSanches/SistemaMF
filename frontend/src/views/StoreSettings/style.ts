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

export const TabsLayout = styled.div`
    display: flex;
    align-items: flex-start;
    gap: 1.5rem;

    @media (max-width: 768px) {
        flex-direction: column;
        gap: 0;
    }
`;

export const TabsContainer = styled.div`
    height: 70vh;
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    min-width: 220px;
    width: 220px;
    flex-shrink: 0;
    border-right: 2px solid #e7b7c2;
    padding-right: 1rem;

    @media (max-width: 768px) {
        height: auto;
        flex-direction: row;
        flex-wrap: nowrap;
        overflow-x: auto;
        width: 100%;
        border-right: none;
        border-bottom: 2px solid #e7b7c2;
        padding-right: 0;
        padding-bottom: 0.5rem;
        margin-bottom: 1rem;
    }
`;

export const Tab = styled.button<{ $active: boolean }>`
    display: flex;
    align-items: center;
    gap: 0.6rem;
    padding: 0.85rem 1rem;
    margin-bottom: 0.25rem;
    background: ${({ $active }) => ($active ? '#EC4899' : 'transparent')};
    border: none;
    border-left: 3px solid ${({ $active }) => ($active ? '#EC4899' : 'transparent')};
    color: ${({ $active }) => ($active ? '#fff' : 'var(--text-title)')};
    font-size: 15px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    white-space: normal;
    border-radius: 0 8px 8px 0;
    text-align: left;
    width: 100%;

    &:hover {
        background: ${({ $active }) => ($active ? '#EC4899' : '#f5f5f5')};
    }

    @media (max-width: 768px) {
        width: auto;
        flex-shrink: 0;
        border-left: none;
        border-bottom: 3px solid ${({ $active }) => ($active ? '#EC4899' : 'transparent')};
        border-radius: 8px 8px 0 0;
        padding: 0.75rem 1rem;
        font-size: 14px;
    }
`;

export const TabContent = styled.div`
    flex: 1;
    min-width: 0;
    background: var(--white-background);
    border-radius: 8px;
    padding: 1.5rem;
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

export const BannerCarouselWrapper = styled.div`
    position: relative;
    width: 100%;

    h2 {
        color: var(--text-title);
    }
`;

export const BannerCarouselSlide = styled.div<{ $visible: boolean }>`
    display: ${({ $visible }) => ($visible ? 'flex' : 'none')};
    flex-direction: column;
    gap: 1rem;

    h3 {
        font-size: 18px;
        color: var(--text-title);
        font-weight: 600;
    }
`;

export const BannerCarouselControls = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 1rem;
    margin-top: 1rem;
`;

export const BannerCarouselNavBtn = styled.button`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 36px;
    height: 36px;
    border-radius: 50%;
    border: 2px solid #EC4899;
    background: #fff;
    color: #EC4899;
    font-size: 14px;
    cursor: pointer;
    transition: all 0.2s;
    flex-shrink: 0;

    &:hover {
        background: #EC4899;
        color: #fff;
    }
`;

export const BannerCarouselDots = styled.div`
    display: flex;
    gap: 0.5rem;
    align-items: center;
`;

export const BannerCarouselDot = styled.button<{ $active: boolean }>`
    width: ${({ $active }) => ($active ? '22px' : '10px')};
    height: 10px;
    border-radius: 5px;
    border: none;
    background: ${({ $active }) => ($active ? '#EC4899' : '#ddd')};
    cursor: pointer;
    transition: all 0.3s;
    padding: 0;

    &:hover {
        background: #EC4899;
    }
`;

export const ScheduleGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;

    @media (max-width: 768px) {
        grid-template-columns: 1fr;
    }
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
        background: white;

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

/* ── Cidades Atendidas ─────────────────────────────────────────── */

export const SectionTitle = styled.h3`
    font-size: 18px;
    font-weight: 700;
    color: var(--text-title);
    margin-bottom: 1.5rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;

    svg {
        color: #EC4899;
    }
`;

export const AddCityForm = styled.div`
    display: flex;
    gap: 0.75rem;
    align-items: flex-end;
    margin-bottom: 2rem;
    flex-wrap: wrap;
    align-items: center;

    > div {
        flex: 1;
        min-width: 160px;
    }

    button {
        margin-top: 28px;
    }

    @media (max-width: 600px) {
        flex-direction: column;
        > div { width: 100%; }
    }
`;

export const AddButton = styled.button`
    padding: 0.75rem 1.5rem;
    background: #EC4899;
    color: #fff;
    border: none;
    border-radius: 8px;
    font-size: 15px;
    font-weight: 600;
    cursor: pointer;
    white-space: nowrap;
    transition: all 0.3s;

    &:hover { filter: brightness(1.1); }
    &:disabled { background: #ccc; cursor: not-allowed; }
`;

export const CityList = styled.div`
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
`;

export const CityItem = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.9rem 1.25rem;
    background: #fafafa;
    border: 1px solid #e7b7c2;
    border-radius: 8px;
    background: white;

    span {
        font-size: 15px;
        color: var(--text-title);
        font-weight: 500;
    }

    .state-badge {
        font-size: 12px;
        background: #fce4ec;
        color: #c2185b;
        padding: 0.2rem 0.6rem;
        border-radius: 20px;
        font-weight: 600;
        margin-left: 0.5rem;
    }
`;

export const RemoveButton = styled.button`
    padding: 0.4rem 0.75rem;
    background: transparent;
    color: #e53935;
    border: 1.5px solid #e53935;
    border-radius: 6px;
    font-size: 13px;
    cursor: pointer;
    transition: all 0.2s;

    &:hover {
        background: #e53935;
        color: #fff;
    }
`;

export const EmptyState = styled.div`
    text-align: center;
    padding: 2.5rem 1rem;
    color: #999;
    font-size: 15px;
    border: 2px dashed #e7b7c2;
    border-radius: 8px;
`;

/* ── Faixas de Frete ───────────────────────────────────────────── */

export const FreightGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 0.75rem;
    margin-bottom: 1.5rem;

    @media (max-width: 1200px) {
        grid-template-columns: repeat(2, 1fr);
    }

    @media (max-width: 600px) {
        grid-template-columns: 1fr;
    }
`;

export const FreightRangeRow = styled.div<{ $disabled: boolean }>`
    display: grid;
    grid-template-columns: auto 160px 1fr auto;
    align-items: center;
    gap: 1rem;
    padding: 1rem 1.25rem;
    background: ${({ $disabled }) => ($disabled ? '#f8f8f8' : '#fff')};
    border: 1px solid ${({ $disabled }) => ($disabled ? '#ebebeb' : '#e7b7c2')};
    border-radius: 8px;
    opacity: ${({ $disabled }) => ($disabled ? 0.6 : 1)};
    transition: all 0.2s;

    @media (max-width: 600px) {
        grid-template-columns: auto 1fr;
        grid-template-rows: auto auto;
    }
`;

export const RangeLabel = styled.span`
    font-size: 15px;
    font-weight: 600;
    color: var(--text-title);
    min-width: 110px;
`;

export const PriceInputWrapper = styled.div`
    display: flex;
    align-items: center;
    gap: 0.4rem;
    position: relative;

    span.prefix {
        font-size: 14px;
        font-weight: 600;
        color: #666;
        white-space: nowrap;
    }

    input {
        width: 100%;
        padding: 0.6rem 0.75rem;
        border: 1.5px solid #e7b7c2;
        border-radius: 6px;
        font-size: 15px;
        font-weight: 600;
        background: transparent;

        &:disabled {
            background: #f0f0f0;
            cursor: not-allowed;
            border-color: #ddd;
        }

        &:focus {
            outline: none;
            border-color: #EC4899;
        }
    }
`;

export const InlineError = styled.span`
    font-size: 12px;
    color: #e53935;
    font-weight: 500;
`;

export const FeedbackMessage = styled.div<{ $type: 'success' | 'error' }>`
    padding: 0.85rem 1.25rem;
    border-radius: 8px;
    margin-bottom: 1.25rem;
    font-size: 14px;
    font-weight: 600;
    background: ${({ $type }) => ($type === 'success' ? '#e8f5e9' : '#ffebee')};
    color: ${({ $type }) => ($type === 'success' ? '#2e7d32' : '#c62828')};
    border: 1px solid ${({ $type }) => ($type === 'success' ? '#a5d6a7' : '#ef9a9a')};
`;

/* ── Catálogo / Carrosséis ─────────────────────────────────────── */

export const CarouselList = styled.div`
    display: flex;
    flex-direction: column;
    gap: 1rem;
    margin-top: 1rem;
`;

export const CarouselCard = styled.div`
    border: 1px solid #e7b7c2;
    border-radius: 10px;
    background: #fff;
    overflow: hidden;
`;

export const CarouselCardHeader = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1rem 1.25rem;
    background: #fdf2f8;
    gap: 1rem;
    flex-wrap: wrap;

    .carousel-name {
        font-size: 15px;
        font-weight: 700;
        color: var(--text-title);
        flex: 1;
    }

    .carousel-actions {
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }
`;

export const ToggleActiveButton = styled.button<{ $active: boolean }>`
    padding: 0.35rem 0.75rem;
    border-radius: 20px;
    border: 2px solid ${({ $active }) => ($active ? '#EC4899' : '#ccc')};
    background: ${({ $active }) => ($active ? '#fce7f3' : '#f5f5f5')};
    color: ${({ $active }) => ($active ? '#EC4899' : '#999')};
    font-size: 12px;
    font-weight: 700;
    cursor: pointer;
    transition: all 0.2s;
    margin-left: 15px;

    &:hover {
        opacity: 0.8;
    }
`;

export const CarouselExpandButton = styled.button`
    background: none;
    border: none;
    cursor: pointer;
    color: #EC4899;
    font-size: 14px;
    font-weight: 600;
    display: flex;
    align-items: center;
    gap: 0.3rem;
    transition: opacity 0.2s;

    &:hover {
        opacity: 0.7;
    }
`;

export const CarouselCardBody = styled.div<{ $open: boolean }>`
    display: ${({ $open }) => ($open ? 'block' : 'none')};
    padding: 1rem 1.25rem;
    border-top: 1px solid #f3e1ec;
`;

export const CarouselProductGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(230px, 1fr));
    gap: 0.6rem;
    margin-bottom: 1rem;
    max-height: 180px;
    overflow-y: auto;
    padding: 0.25rem;
`;

export const CarouselProductItem = styled.label`
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.45rem 0.6rem;
    border: 1px solid #f0d0e1;
    border-radius: 6px;
    cursor: pointer;
    font-size: 13px;
    font-weight: 500;
    color: var(--text-title);
    background: #fff;
    transition: background 0.15s;
    overflow: hidden;

    &:hover {
        background: #fce7f3;
    }

    img {
        width: 36px;
        height: 36px;
        object-fit: cover;
        border-radius: 4px;
        flex-shrink: 0;
    }

    span {
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
    }
`;

export const CreateCarouselForm = styled.div`
    background: #fdf2f8;
    border: 1px dashed #e7b7c2;
    border-radius: 10px;
    padding: 1.25rem;
    margin-bottom: 1.5rem;

    h3 {
        font-size: 16px;
        font-weight: 700;
        color: var(--text-title);
        margin-bottom: 1rem;
        display: flex;
        align-items: center;
        gap: 0.4rem;
    }
`;

export const ProductSearchInput = styled.input`
    width: 100%;
    padding: 0.6rem 0.9rem;
    border: 1.5px solid #e7b7c2;
    border-radius: 8px;
    font-size: 14px;
    outline: none;
    margin-bottom: 0.75rem;
    background: #fff;

    &:focus {
        border-color: #EC4899;
    }
`;

export const ProductSelectionGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 0.6rem;
    max-height: 260px;
    overflow-y: auto;
    padding: 0.25rem;
    margin-bottom: 1rem;
    border: 1px solid #f3e1ec;
    border-radius: 8px;
    background: #fff;
`;

export const ProductSelectionItem = styled.label<{ $selected: boolean }>`
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.45rem 0.6rem;
    border: 2px solid ${({ $selected }) => ($selected ? '#EC4899' : '#f0d0e1')};
    border-radius: 6px;
    cursor: pointer;
    font-size: 13px;
    font-weight: 500;
    color: var(--text-title);
    background: ${({ $selected }) => ($selected ? '#fce7f3' : '#fff')};
    transition: all 0.15s;
    overflow: hidden;
    position: relative;

    &:hover {
        background: #fce7f3;
        border-color: #EC4899;
    }

    img {
        width: 36px;
        height: 36px;
        object-fit: cover;
        border-radius: 4px;
        flex-shrink: 0;
    }
    
    input {
        height: 0;
        opacity: 0;
        position: absolute;
    }

    .product-info {
        display: flex;
        flex-direction: column;
        span {
            flex: 1;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
        }

        .price {
            font-size: 12px;
            color: #EC4899;
            font-weight: 700;
            flex-shrink: 0;
        }
    }
`;

export const SelectedCount = styled.span`
    font-size: 13px;
    color: #EC4899;
    font-weight: 600;
    margin-bottom: 0.75rem;
    display: block;
`;

export const CarouselNameInput = styled.input`
    width: 100%;
    padding: 0.7rem 0.9rem;
    border: 1.5px solid #e7b7c2;
    border-radius: 8px;
    font-size: 15px;
    font-weight: 600;
    outline: none;
    margin-bottom: 1rem;
    background: #fff;

    &::placeholder {
        font-weight: 400;
        color: #bbb;
    }

    &:focus {
        border-color: #EC4899;
    }
`;

