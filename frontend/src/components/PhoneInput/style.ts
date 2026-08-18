import styled from 'styled-components';

export const PhoneInputWrapper = styled.div<{ $hasError?: boolean }>`
    .PhoneInput {
        display: flex;
        align-items: center;
        border: 1px solid ${({ $hasError }) => ($hasError ? '#d64545' : '#e7b7c2')};
        border-radius: 8px;
        padding: 0 12px;
        background: #fff;

        &:focus-within {
            border-color: #d48a9b;
        }
    }

    .PhoneInputCountry {
        width: auto !important;
        margin-right: 8px;
    }

    .PhoneInputCountrySelect {
        cursor: pointer;
    }

    .PhoneInputCountryIconUnicode {
        font-size: 20px;
        line-height: 1;
    }

    .PhoneInputInput {
        flex: 1;
        border: none;
        outline: none;
        padding: 12px 0;
        font-size: 16px;
        background: transparent;

        &:disabled {
            color: var(--text-body);
            opacity: 0.7;
        }
    }
`;
