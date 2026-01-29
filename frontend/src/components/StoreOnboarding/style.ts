import styled from "styled-components";

export const OnboardingOverlay = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.8);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 9999;
    padding: 20px;
`;

export const OnboardingContainer = styled.div`
    background: white;
    border-radius: 12px;
    max-width: 800px;
    width: 100%;
    max-height: 90vh;
    overflow-y: auto;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
`;

export const OnboardingHeader = styled.div`
    background: #EC4899;
    color: white;
    padding: 30px;
    border-radius: 12px 12px 0 0;
    text-align: center;

    h2 {
        margin: 0 0 10px 0;
        font-size: 28px;
        font-weight: 600;
    }

    p {
        margin: 0;
        font-size: 16px;
        opacity: 0.9;
    }
`;

export const OnboardingProgress = styled.div`
    display: flex;
    justify-content: space-between;
    padding: 20px 30px;
    background: #f8f9fa;
    border-bottom: 1px solid #e9ecef;
`;

export const ProgressStep = styled.div<{ active?: boolean; completed?: boolean }>`
    display: flex;
    flex-direction: column;
    align-items: center;
    flex: 1;
    position: relative;

    &:not(:last-child)::after {
        content: '';
        position: absolute;
        top: 15px;
        left: 60%;
        width: 80%;
        height: 2px;
        background: ${props => props.completed ? '#EC4899' : '#dee2e6'};
    }

    .step-number {
        width: 32px;
        height: 32px;
        border-radius: 50%;
        background: ${props => props.active ? '#EC4899' : props.completed ? '#EC4899' : '#dee2e6'};
        color: white;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: 600;
        font-size: 14px;
        margin-bottom: 8px;
        z-index: 1;
    }

    .step-label {
        font-size: 12px;
        color: ${props => props.active ? '#EC4899' : '#6c757d'};
        font-weight: ${props => props.active ? '600' : '400'};
        text-align: center;
    }
`;

export const OnboardingBody = styled.div`
    padding: 30px;

    h3 {
        margin: 0 0 20px 0;
        color: #333;
        font-size: 22px;
    }

    .form-row {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 20px;
        margin-bottom: 20px;

        &.single-column {
            grid-template-columns: 1fr;
        }
    }

    .form-input {
        display: flex;
        flex-direction: column;

        p {
            margin: 0 0 8px 0;
            font-weight: 500;
            color: #495057;
            font-size: 14px;

            span {
                color: red;
            }
        }

        input, select {
            padding: 12px 15px;
            border: 1px solid #ced4da;
            border-radius: 6px;
            font-size: 14px;
            transition: all 0.2s;

            &:focus {
                outline: none;
                border-color: var(--primary-color);
                box-shadow: 0 0 0 3px rgba(255, 102, 196, 0.1);
            }
        }

        .time-inputs {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 10px;

            input {
                width: 100%;
            }
        }
    }

    .checkbox-group {
        display: flex;
        align-items: center;
        gap: 10px;
        margin-bottom: 15px;

        input[type="checkbox"] {
            width: 18px;
            height: 18px;
            cursor: pointer;
        }

        label {
            font-size: 14px;
            color: #495057;
            cursor: pointer;
        }
    }

    .schedule-card {
        border: 1px solid #e9ecef;
        border-radius: 8px;
        padding: 15px;
        margin-bottom: 15px;
        background: #f8f9fa;

        .day-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 15px;

            h4 {
                margin: 0;
                font-size: 16px;
                color: #333;
            }
        }
    }

    .banner-upload-section {
        margin-bottom: 20px;
    }

    .media-upload-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 30px;

        @media (max-width: 768px) {
            grid-template-columns: 1fr;
        }
    }

    .media-upload-section {
        h4 {
            margin: 0 0 8px 0;
            font-size: 16px;
            color: #333;
            display: flex;
            align-items: center;
            gap: 8px;

            svg {
                color: var(--primary-color);
            }
        }

        .media-description {
            font-size: 13px;
            color: #6c757d;
            margin: 0 0 15px 0;
        }
    }

    .media-upload-box {
        border: 2px dashed #ced4da;
        border-radius: 8px;
        padding: 30px;
        text-align: center;
        cursor: pointer;
        transition: all 0.3s;
        background: #f8f9fa;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;

        &:hover {
            border-color: var(--primary-color);
            background: #fff;
        }

        svg {
            font-size: 36px;
            color: var(--primary-color);
            margin-bottom: 10px;
        }

        span {
            display: block;
            color: #6c757d;
            font-size: 13px;

            &.format-info {
                font-size: 11px;
                margin-top: 5px;
                color: #adb5bd;
            }
        }

        &.avatar-upload {
            height: 180px;
        }

        &.banner-upload {
            height: 180px;
        }
    }

    .avatar-preview-container {
        .avatar-preview-box {
            width: 150px;
            height: 150px;
            border-radius: 50%;
            overflow: hidden;
            margin: 0 auto 15px;
            border: 3px solid var(--primary-color);

            img {
                width: 100%;
                height: 100%;
                object-fit: cover;
            }
        }
    }

    .media-actions {
        display: flex;
        gap: 10px;
        justify-content: center;

        button {
            padding: 8px 16px;
            border: none;
            border-radius: 6px;
            cursor: pointer;
            font-size: 13px;
            transition: all 0.2s;

            &.btn-change {
                background: #EC4899;
                color: white;

                &:hover {
                    opacity: 0.9;
                }
            }

            &.btn-remove {
                background: #dc3545;
                color: white;

                &:hover {
                    opacity: 0.9;
                }
            }
        }
    }

    .banner-upload-box {
        border: 2px dashed #ced4da;
        border-radius: 8px;
        padding: 40px;
        text-align: center;
        cursor: pointer;
        transition: all 0.3s;
        background: #f8f9fa;

        &:hover {
            border-color: var(--primary-color);
            background: #fff;
        }

        svg {
            font-size: 48px;
            color: var(--primary-color);
            margin-bottom: 15px;
        }

        span {
            display: block;
            color: #6c757d;
            font-size: 14px;

            &.format-info {
                font-size: 12px;
                margin-top: 5px;
                color: #adb5bd;
            }
        }
    }

    .banner-preview-container {
        .banner-preview-box {
            width: 100%;
            height: 150px;
            border-radius: 8px;
            overflow: hidden;
            margin-bottom: 15px;
            border: 1px solid #dee2e6;

            img {
                width: 100%;
                height: 100%;
                object-fit: cover;
            }
        }
    }

    .payment-section {
        border: 1px solid #e9ecef;
        border-radius: 8px;
        padding: 20px;
        margin-bottom: 20px;
        background: #fafafa;

        .payment-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 15px;
            flex-wrap: wrap;
            gap: 10px;

            h4 {
                margin: 0;
                font-size: 18px;
                color: #333;
            }
        }

        .payment-fields {
            .form-input {
                margin-bottom: 15px;

                textarea {
                    width: 100%;
                    padding: 12px 15px;
                    border: 1px solid #ced4da;
                    border-radius: 6px;
                    font-size: 13px;
                    font-family: 'Courier New', monospace;
                    resize: vertical;
                    transition: all 0.2s;

                    &:focus {
                        outline: none;
                        border-color: var(--primary-color);
                        box-shadow: 0 0 0 3px rgba(255, 102, 196, 0.1);
                    }

                    &::placeholder {
                        color: #adb5bd;
                    }
                }
            }
        }
    }

    .info-box {
        background: #e7f3ff;
        border-left: 4px solid #0066cc;
        padding: 15px;
        border-radius: 4px;
        margin-bottom: 20px;

        p {
            margin: 0;
            color: #004085;
            font-size: 14px;
            line-height: 1.5;
        }
    }
`;

export const OnboardingFooter = styled.div`
    padding: 20px 30px;
    background: #f8f9fa;
    border-top: 1px solid #e9ecef;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-radius: 0 0 12px 12px;

    button {
        padding: 12px 30px;
        border: none;
        border-radius: 6px;
        font-size: 14px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.2s;

        &.btn-back {
            background: white;
            color: #6c757d;
            border: 1px solid #ced4da;

            &:hover {
                background: #f8f9fa;
            }

            &:disabled {
                opacity: 0.5;
                cursor: not-allowed;
            }
        }

        &.btn-next {
            background: #EC4899;
            color: white;

            &:hover {
                opacity: 0.9;
            }

            &:disabled {
                opacity: 0.5;
                cursor: not-allowed;
            }
        }

        &.btn-skip {
            background: transparent;
            color: #6c757d;
            text-decoration: underline;
            padding: 12px 20px;

            &:hover {
                color: #495057;
            }
        }
    }
`;

export const SuccessMessage = styled.div`
    text-align: center;
    padding: 40px 20px;

    svg {
        font-size: 64px;
        color: #28a745;
        margin-bottom: 20px;
    }

    h3 {
        color: #333;
        margin-bottom: 15px;
    }

    p {
        color: #6c757d;
        margin-bottom: 30px;
        line-height: 1.6;
    }

    button {
        padding: 12px 40px;
        background: var(--primary-color);
        color: white;
        border: none;
        border-radius: 6px;
        font-size: 16px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.2s;

        &:hover {
            opacity: 0.9;
        }
    }
`;
