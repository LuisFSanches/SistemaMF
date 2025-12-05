import styled from 'styled-components'
import { Input, PrimaryButton } from '../../styles/global'

export const Container = styled.div`
    width: 100%;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    background: #FAFAFA;
    overflow-x: hidden;

    @media (max-width: 768px) {
        padding-bottom: 80px;
    }
`

// Stepper
export const StepperContainer = styled.div`
    width: 100%;
    background: white;
    padding-bottom: 24px;
    padding-top: 8px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    position: sticky;
    top: 0;
    z-index: 100;

    @media (max-width: 768px) {
        padding: 16px;
    }
`;

export const StepperWrapper = styled.div`
    max-width: 600px;
    margin: 0 auto;
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: relative;

    &::before {
        content: '';
        position: absolute;
        top: 20px;
        left: 60px;
        right: 60px;
        height: 2px;
        background: #E5E7EB;
        z-index: 0;
    }

    @media (max-width: 768px) {
        &::before {
            left: 40px;
            right: 40px;
        }
    }
`;

export const Step = styled.div<{ active: boolean; completed: boolean; clickable?: boolean }>`
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    position: relative;
    z-index: 1;
    cursor: ${({ clickable }) => (clickable ? 'pointer' : 'default')};
    transition: all 0.3s ease;

    &:hover {
        ${({ clickable }) => clickable && `
            transform: translateY(-2px);
        `}
    }

    @media (max-width: 768px) {
        gap: 4px;
    }
`;

export const StepCircle = styled.div<{ active: boolean; completed: boolean }>`
    width: 40px;
    height: 40px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 600;
    font-size: 1rem;
    background: ${({ active, completed }) =>
        completed ? '#EC4899' : active ? '#EC4899' : 'white'};
    color: ${({ active, completed }) =>
        completed || active ? 'white' : '#9CA3AF'};
    border: 2px solid ${({ active, completed }) =>
        completed ? '#EC4899' : active ? '#EC4899' : '#E5E7EB'};
    transition: all 0.3s ease;

    @media (max-width: 768px) {
        width: 32px;
        height: 32px;
        font-size: 0.875rem;
    }
`;

export const StepLabel = styled.div<{ active: boolean }>`
    font-size: 0.875rem;
    font-weight: ${({ active }) => (active ? '600' : '500')};
    color: ${({ active }) => (active ? '#333' : '#6B7280')};
    text-align: center;
    white-space: nowrap;

    @media (max-width: 768px) {
        font-size: 0.75rem;
    }
`;

export const StepSubLabel = styled.div`
    font-size: 0.75rem;
    color: #9CA3AF;
    text-align: center;

    @media (max-width: 768px) {
        font-size: 0.65rem;
    }
`;

// Header da Página
export const PageHeader = styled.div`
    width: 100%;
    padding: 24px;
    background: white;
    border-bottom: 1px solid #F0F0F0;

    @media (max-width: 768px) {
        padding: 16px;
    }
`;

export const PageHeaderContent = styled.div`
    max-width: 1400px;
    margin: 0 auto;
    display: flex;
    justify-content: space-between;
    align-items: center;
`;

export const PageTitle = styled.h1`
    font-size: 1.75rem;
    color: #333;
    margin: 0;

    @media (max-width: 768px) {
        font-size: 1.5rem;
    }
`;

// Search Bar
export const SearchContainer = styled.div`
    margin-bottom: 24px;
    position: relative;
    display: flex;
    gap: 8px;

    svg {
        position: absolute;
        left: 16px;
        top: 50%;
        transform: translateY(-50%);
        color: #9CA3AF;
        pointer-events: none;
    }

    @media (max-width: 768px) {
        margin-bottom: 16px;
    }
`;

export const SearchButton = styled.button`
    background: #EC4899;
    border: none;
    border-radius: 8px;
    padding: 12px 16px;
    color: white;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s ease;
    min-width: 48px;

    &:hover {
        background: #DB2777;
        transform: translateY(-1px);
    }

    &:active {
        transform: translateY(0);
    }

    .material-icons {
        font-size: 1.2rem;
    }
`;

export const SearchInput = styled.input`
    flex: 1;
    padding: 12px 16px 12px 48px;
    border: 1px solid #E5E7EB;
    border-radius: 8px;
    font-size: 0.95rem;
    transition: all 0.2s ease;
    background: white;

    &:focus {
        outline: none;
        border-color: #EC4899;
        box-shadow: 0 0 0 3px rgba(236, 72, 153, 0.1);
    }

    &::placeholder {
        color: #9CA3AF;
    }
`;

// Cart Sidebar (Desktop) / Bottom Bar (Mobile)
export const CartContainer = styled.div<{ expanded?: boolean }>`
    width: 350px;
    background: white;
    border-radius: 12px;
    padding: 24px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    position: sticky;
    top: 120px;
    max-height: calc(100vh - 140px);
    display: flex;
    flex-direction: column;

    @media (max-width: 768px) {
        position: fixed;
        bottom: 0;
        left: 0;
        right: 0;
        width: 100%;
        border-radius: 16px 16px 0 0;
        padding: 16px;
        max-height: ${({ expanded }) => (expanded ? '85vh' : 'auto')};
        box-shadow: 0 -4px 12px rgba(0, 0, 0, 0.1);
        z-index: 50;
        top: auto;
        transition: max-height 0.3s ease;
    }
`;

export const CartHeader = styled.div<{ expanded?: boolean }>`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
    padding-bottom: 16px;
    border-bottom: 1px solid #F0F0F0;

    h3 {
        font-size: 1.1rem;
        color: #333;
        margin: 0;
        display: flex;
        align-items: center;
        gap: 8px;
    }

    @media (max-width: 768px) {
        cursor: pointer;
        margin-bottom: ${({ expanded }) => (expanded ? '16px' : '0')};
        padding-bottom: ${({ expanded }) => (expanded ? '16px' : '0')};
        border-bottom: ${({ expanded }) => (expanded ? '1px solid #F0F0F0' : 'none')};
        
        .material-icons:not(.cart) {
            display: inline-block !important;
            transition: transform 0.3s ease;
        }
    }
`;

export const CartBadge = styled.span`
    background: #EC4899;
    color: white;
    border-radius: 50%;
    width: 24px;
    height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.75rem;
    font-weight: 600;
`;

export const CartItems = styled.div<{ expanded?: boolean }>`
    flex: 1;
    overflow-y: auto;
    margin-bottom: 16px;

    ::-webkit-scrollbar {
        width: 6px;
    }

    ::-webkit-scrollbar-track {
        background: transparent;
    }

    ::-webkit-scrollbar-thumb {
        background: #E7B7C2;
        border-radius: 10px;
    }

    @media (max-width: 768px) {
        max-height: ${({ expanded }) => (expanded ? '40vh' : '0')};
        overflow: ${({ expanded }) => (expanded ? 'auto' : 'hidden')};
        transition: max-height 0.3s ease;
    }
`;

export const CartItem = styled.div`
    display: flex;
    gap: 12px;
    padding: 12px;
    background: #F8F6F7;
    border-radius: 8px;
    margin-bottom: 8px;

    img {
        width: 50px;
        height: 50px;
        object-fit: cover;
        border-radius: 6px;
    }
`;

export const CartItemInfo = styled.div`
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
`;

export const CartItemName = styled.div`
    font-size: 0.9rem;
    font-weight: 500;
    color: #333;
    margin-bottom: 4px;
`;

export const CartItemPrice = styled.div`
    font-size: 0.875rem;
    color: #EC4899;
    font-weight: 600;
`;

export const CartItemQuantity = styled.div`
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 0.875rem;
    color: #6B7280;
`;

export const CartTotal = styled.div<{ expanded?: boolean }>`
    padding-top: 16px;
    border-top: 2px solid #F0F0F0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 1.1rem;
    font-weight: 700;
    color: #333;
    margin-bottom: 16px;

    span:last-child {
        color: #EC4899;
    }

    @media (max-width: 768px) {
        display: ${({ expanded }) => (expanded ? 'flex' : 'none')};
    }
`;

export const ContinueButton = styled.button<{ expanded?: boolean }>`
    width: 100%;
    padding: 14px;
    background: linear-gradient(135deg, #EC4899 0%, #D946A0 100%);
    color: white;
    font-weight: 600;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0 2px 8px rgba(236, 72, 153, 0.25);

    &:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(236, 72, 153, 0.35);
    }

    &:active {
        transform: translateY(0);
    }

    &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
        transform: none;
    }

    @media (max-width: 768px) {
        display: ${({ expanded }) => (expanded ? 'block' : 'none')};
    }
`;

export const NewOrderContainer = styled.div`
    width: 100%;
    display: flex;
    flex: 1;
    gap: 24px;
    padding: 24px;
    margin: 0 auto;

    .pagination-mobile {
        display: none;
    }

    @media (max-width: 768px) {
        flex-direction: column;
        padding: 16px;
        gap: 16px;

        .pagination-mobile {
            display: block;
        }
    }
`;

export const ProductContainer = styled.div`
    flex: 1;
    overflow-y: auto;
    padding-right: 8px;

    ::-webkit-scrollbar {
        width: 6px;
    }

    ::-webkit-scrollbar-track {
        background: transparent;
    }

    ::-webkit-scrollbar-thumb {
        background: #E7B7C2;
        border-radius: 10px;
    }

    ::-webkit-scrollbar-thumb:hover {
        background: #D48A9B;
    }

    @media (max-width: 768px) {
        padding-right: 0;
    }
`

export const NewProductButton = styled.button`
    display: flex;
    padding: 10px 16px;
    border-radius: 8px;
    background: linear-gradient(135deg, #EC4899 0%, #D946A0 100%);
    color: white;
    font-weight: 600;
    font-size: 0.9rem;
    border: none;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0 2px 8px rgba(236, 72, 153, 0.25);;

    &:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(236, 72, 153, 0.35);
    }

    @media (max-width: 768px) {
        font-size: 11px;
        padding: 8px;
        margin-top: 8px;
    }
`

export const ProductList = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
    gap: 16px;
    margin-top: 16px;
    overflow-x: hidden;

    @media (min-width: 900px) {
        grid-template-columns: repeat(2, 1fr);
    }

    @media (min-width: 1270px) {
        grid-template-columns: repeat(3, 1fr);
    }

    @media (min-width: 1500px) {
        grid-template-columns: repeat(4, 1fr);
    }

    @media (min-width: 1650px) {
        grid-template-columns: repeat(5, 1fr);
    }

    @media (min-width: 1900px) {
        grid-template-columns: repeat(6, 1fr);
    }

    @media (min-width: 2250px) {
        grid-template-columns: repeat(7, 1fr);
    }

    @media (min-width: 2310px) {
        grid-template-columns: repeat(7, 1fr);
    }

    @media (max-width: 768px) {
        grid-template-columns: repeat(2, 1fr);
        gap: 12px;
    }
`;

export const FormContainer = styled.div`
    flex: 1;
    display: flex;
    flex-direction: column;
`;

export const PageHeaderActions = styled.div`
    display: flex;
    gap: 12px;
    align-items: center;
`;

export const SwitchDetail = styled.p`
    font-weight: 600;
    font-size: 0.9rem;
    color: #EC4899;
    white-space: nowrap;
`

export const FormHeader = styled.div`
    width: 100%;
    text-align: center;
    border-bottom: 1px solid #F0F0F0;
    padding-bottom: 16px;

    h2 {
        font-size: 1.3rem;
        color: #333;
        margin: 0;
    }

    @media (max-width: 768px) {
        padding: 16px 0 12px;
        
        h2 {
            font-size: 1.25rem;
        }
    }
`

export const Form = styled.form<{ step?: number }>`
    width: 100%;
    max-width: 600px;
    display: flex;
    flex-direction: column;
    background: white;
    border-radius: 12px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    overflow-y: auto;
    padding: 24px;
    margin: 0 auto;

    ::-webkit-scrollbar {
        width: 6px;
    }

    ::-webkit-scrollbar-track {
        background: transparent;
    }

    ::-webkit-scrollbar-thumb {
        background: #E7B7C2;
        border-radius: 10px;
    }

    ::-webkit-scrollbar-thumb:hover {
        background: #D48A9B;
    }

    @media (max-width: 768px) {
        border-radius: 8px;
        padding: 20px 16px;
    }
`

export const InlineFormField = styled.div`
    display: flex;
    gap: 12px;
    width: 100%;

    > div {
        flex: 1;
    }

    @media(max-width: 768px){
        flex-direction: column;
        gap: 0;
    }
`

export const StepButton = styled.button`
    padding: 12px 24px;
    border-radius: 8px;
    background: linear-gradient(135deg, #EC4899 0%, #D946A0 100%);
    color: white;
    font-size: 1rem;
    font-weight: 600;
    border: none;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0 2px 8px rgba(236, 72, 153, 0.25);

    &:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(236, 72, 153, 0.35);
    }

    &:active {
        transform: translateY(0);
    }

    @media (max-width: 768px) {
        width: 100%;
        padding: 14px;
    }
`

export const ActionButtons = styled.div`
    display: flex;
    gap: 12px;
    margin-top: 24px;
    padding-top: 24px;
    border-top: 1px solid #F0F0F0;

    button {
        flex: 1;
    }

    @media (max-width: 768px) {
        margin-top: 16px;
        padding-top: 16px;
    }
`

export const CheckboxContainer = styled.div<{alignLeft?: boolean}>`
    display: flex;
    align-items: center;
    margin: 16px 0;
    align-self: ${({ alignLeft }) => (alignLeft ? 'flex-start' : 'flex-end')};    
  
    label {
        margin-left: 8px;
        font-size: 0.9rem;
        color: #5B5B5B;
        cursor: pointer;
    }
`;

export const Checkbox = styled.input`
    width: 18px;
    height: 18px;
    appearance: none;
    border: 2px solid #E7B7C2;
    border-radius: 4px;
    outline: none;
    cursor: pointer;
    position: relative;
    transition: all 0.2s ease;

    &:focus {
        border-color: #EC4899;
        box-shadow: 0 0 0 3px rgba(236, 72, 153, 0.1);
    }

    &:checked {
        background-color: #EC4899;
        border-color: #EC4899;
    }

    &:checked::after {
        content: '✓';
        color: white;
        font-size: 18px;
        position: absolute;
        top: 0px;
        left: 5px;
        font-weight: bold;
    }

    &:hover {
        border-color: #EC4899;
    }
`;

export const ErrorMessage = styled.span`
    color: #EF4444;
    font-size: 0.875rem;
    margin-top: 4px;
    display: block;
`

export const OrderSummary = styled.div`
    width: 100%;
    max-width: 500px;
    background: white;
    border-radius: 12px;
    padding: 24px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);

    h2 {
        font-size: 1.25rem;
        color: #333;
        margin-bottom: 16px;
    }

    @media (max-width: 768px) {
        padding: 20px;
        
        h2 {
            font-size: 1.1rem;
        }
    }
`

export const DiscountSwitch = styled.div`
    width: 100%;
    display: flex;
    align-items: center;
    flex: 1;
    gap: 10px;
    margin: 12px 0;

    span {
        font-size: 0.875rem;
        color: #5B5B5B;
        font-weight: 500;
    }

    input {
        opacity: 0;
        width: 0;
        height: 0;
    }
`;

export const DiscountSwitchLabel = styled.label<{ $checked: boolean }>`
    position: relative;
    display: inline-block;
    width: 44px;
    height: 24px;
    background-color: ${({ $checked }) => ($checked ? "#EC4899" : "#D1D5DB")};
    border-radius: 24px;
    cursor: pointer;
    transition: background-color 0.25s ease;

    &::after {
        content: "";
        position: absolute;
        left: ${({ $checked }) => ($checked ? "22px" : "2px")};
        top: 2px;
        width: 20px;
        height: 20px;
        background: white;
        border-radius: 50%;
        transition: left 0.25s ease;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    }
`;

export const PriceSummary = styled.div`
    width: 100%;
    margin: 16px 0;
    padding: 16px;
    background: #FAFAFA;
    border: 1px solid #F0F0F0;
    border-radius: 8px;
    font-size: 0.9rem;
    color: #5B5B5B;

    .summary-line {
        display: flex;
        justify-content: space-between;
        margin-bottom: 8px;
        
        span:first-child {
            font-weight: 400;
        }
        
        span:last-child {
            font-weight: 600;
        }
    }

    .summary-total {
        display: flex;
        justify-content: space-between;
        margin-top: 12px;
        padding-top: 12px;
        border-top: 2px solid #E7B7C2;
        font-size: 1.15rem;
        
        span {
            font-weight: 700;
            color: #EC4899;
        }
    }
`;

export const ProductHeaderContainer = styled.div`
    margin-bottom: 16px;
    display: flex;
    justify-content: space-between;
    align-items: center;

    @media (max-width: 768px) {
        flex-direction: column;
        align-items: flex-start;
    }
`;

export const ProductHeaderContent = styled.div`
    h2 {
        font-size: 1.5rem;
        color: #333;
        margin: 0;
    }

    p {
        color: #6B7280;
        font-size: 0.9rem;
        margin: 4px 0 0 0;
    }
`;

export const CartEmptyMessage = styled.p`
    text-align: center;
    color: #9CA3AF;
    padding: 20px 0;
`;

export const RemoveProductButton = styled.button`
    background: transparent;
    border: none;
    color: #EF4444;
    cursor: pointer;
    padding: 4px;

    i {
        font-size: 1rem;
    }
`;

export const MaterialIcon = styled.i<{ $size?: string; $color?: string }>`
    font-size: ${({ $size }) => $size || '1rem'};
    color: ${({ $color }) => $color || 'inherit'};

    &.cart {
        color: #EC4899;
    }
`;

export const DiscountSection = styled.div<{ expanded?: boolean }>`
    padding: 5px 5px;
    border-top: 1px solid #F3F4F6;

    @media (max-width: 768px) {
        display: ${({ expanded }) => (expanded ? 'block' : 'none')};
    }
`;

export const DiscountLabel = styled.div`
    margin-bottom: 8px;
    font-size: 0.875rem;
    font-weight: 600;
    color: #5b5b5b;
`;

export const DiscountInputContainer = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
`;

export const DiscountInput = styled(Input)`
    width: 100px;
    height: 36px;
    text-align: center;
`;

export const DiscountAppliedText = styled.div`
    font-size: 0.85rem;
    color: #6aa84f;
    font-weight: 600;
    margin-top: 4px;
`;

export const TotalSection = styled.div<{ expanded?: boolean }>`
    padding: 12px;
    background: #FFF5F7;
    border-top: 1px solid #FCE7F3;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;

    @media (max-width: 768px) {
        display: ${({ expanded }) => (expanded ? 'flex' : 'none')};
    }
`;

export const TotalLabel = styled.span`
    font-size: 1.1rem;
    font-weight: 600;
    color: #333;
`;

export const TotalValue = styled.span`
    font-size: 1.3rem;
    font-weight: 700;
    color: #EC4899;
`;

export const FormSubtitle = styled.p`
    color: #6B7280;
    font-size: 0.9rem;
`;

export const SectionCard = styled.div`
    background: #FFF5F7;
    padding: 16px;
    border-radius: 8px;
    margin-bottom: 24px;
    border: 1px solid #FCE7F3;
`;

export const SectionHeader = styled.div`
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 16px;

    h3 {
        font-size: 1rem;
        color: #333;
        margin: 0;
    }
`;

export const DeliveryToggleContainer = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 8px;
`;

export const DeliveryToggleContent = styled.div`
    display: flex;
    align-items: center;
    gap: 8px;

    h3 {
        font-size: 1rem;
        color: #333;
        margin: 0;
    }

    p {
        font-size: 0.875rem;
        color: #6B7280;
        margin: 4px 0 0 0;
    }
`;

export const HiddenCheckbox = styled(Input)`
    opacity: 0;
    width: 0;
    height: 0;
`;

export const SummarySection = styled.div`
    margin-bottom: 24px;
`;

export const SummarySectionTitle = styled.h3`
    font-size: 1rem;
    color: #333;
    margin-bottom: 12px;
    display: flex;
    align-items: center;
    gap: 8px;
`;

export const ProductSummaryItem = styled.div`
    padding: 12px;
    background: #FAFAFA;
    border-radius: 8px;
    margin-bottom: 8px;
    display: flex;
    justify-content: space-between;
    border: 1px solid #F3F4F6;
`;

export const ProductSummaryName = styled.div`
    font-weight: 500;
    color: #333;
`;

export const ProductSummaryQuantity = styled.div`
    font-size: 0.875rem;
    color: #6B7280;
`;

export const ProductSummaryPrice = styled.div`
    font-weight: 600;
    color: #EC4899;
`;

export const SummaryInfoText = styled.div`
    font-size: 0.9rem;
    color: #374151;
    line-height: 1.8;
`;

export const SummaryDivider = styled.div`
    margin-top: 8px;
    padding-top: 8px;
    border-top: 1px solid #FCE7F3;
`;

export const BackButton = styled(PrimaryButton)`
    background: #6B7280;
`;
