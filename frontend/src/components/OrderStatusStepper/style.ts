import styled from 'styled-components';

export const StepperContainer = styled.div`
    width: 100%;
    background: white;
    padding: 24px 16px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    border-radius: 8px;
    margin: 20px 0;

    @media (max-width: 768px) {
        padding: 16px 8px;
        margin: 12px 0;
    }
`;

export const StepperWrapper = styled.div`
    max-width: 900px;
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

    @media (max-width: 1024px) {
        &::before {
            left: 50px;
            right: 50px;
        }
    }

    @media (max-width: 768px) {
        &::before {
            left: 30px;
            right: 30px;
            top: 16px;
        }
    }
`;

export const Step = styled.div<{ active: boolean; completed: boolean }>`
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    position: relative;
    z-index: 1;
    transition: all 0.3s ease;
    flex: 1;
    max-width: 140px;

    @media (max-width: 768px) {
        gap: 4px;
        max-width: 80px;
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
        completed ? '#10B981' : active ? '#EC4899' : 'white'};
    color: ${({ active, completed }) =>
        completed || active ? 'white' : '#9CA3AF'};
    border: 2px solid ${({ active, completed }) =>
        completed ? '#10B981' : active ? '#EC4899' : '#E5E7EB'};
    transition: all 0.3s ease;
    box-shadow: ${({ active, completed }) =>
        completed || active ? '0 4px 6px rgba(0, 0, 0, 0.1)' : 'none'};

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
    line-height: 1.2;

    @media (max-width: 1024px) {
        font-size: 0.8rem;
        white-space: normal;
    }

    @media (max-width: 768px) {
        font-size: 0.65rem;
    }
`;

export const StepSubLabel = styled.div`
    font-size: 0.75rem;
    color: #9CA3AF;
    text-align: center;
    white-space: nowrap;

    @media (max-width: 1024px) {
        font-size: 0.7rem;
    }

    @media (max-width: 768px) {
        font-size: 0.6rem;
        display: none;
    }
`;
