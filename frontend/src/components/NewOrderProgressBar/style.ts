import styled, { css } from 'styled-components';

export const ProgressBarContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: relative;
  width: 80%;
  padding: 20px 0;
`;

export const Step = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  z-index: 2;
`;

export const StepIndicator = styled.div<{ active: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background-color: ${({ active }) => (active ? '#fcc5d0' : '#F3DBE0')};
  color: var(--text-body);
  font-weight: bold;
  font-size: 18px;
`;

export const StepLabel = styled.span<{ active: boolean }>`
  margin-top: 8px;
  color: var(--text-body);
  border-bottom: ${({ active }) => (active ? '3px solid var(--sideBarBackground)' : 'none')};
  font-size: 14px;
  font-weight: 700;
`;

export const Progress = styled.div<{ activeStep: number }>`
  position: absolute;
  top: 40%;
  left: 15px;
  right: 15px;
  height: 4px;
  background-color: #7D7D7D;
  transform: translateY(-50%);
  z-index: 1;

  ${({ activeStep }) =>
    activeStep &&
    css`
      background: linear-gradient(
        to right,
        #f5cb2e ${(activeStep - 1) * 33.33}%,
        #7d7d7d ${(activeStep - 1) * 33.33}%
      );
    `}
`;
