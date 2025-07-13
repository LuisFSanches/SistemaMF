import React from 'react';
import * as S from './style';

interface NewOrderProgressBarProps {
	steps: string[];
	currentStep: number;
}


export const NewOrderProgressBar: React.FC<NewOrderProgressBarProps> = ({ steps, currentStep }) => {
	return (
		<S.ProgressBarContainer>
			{steps.map((step, index) => (
			<S.Step key={index}>
				<S.StepIndicator active={index + 1 <= currentStep}>
				{index + 1}
				</S.StepIndicator>
				<S.StepLabel active={index + 1 <= currentStep}>{step}</S.StepLabel>
			</S.Step>
			))}
			<S.Progress activeStep={currentStep} />
		</S.ProgressBarContainer>
	);
};
