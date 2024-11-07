import React from 'react';
import * as S from './style';

interface NewOrderProgressBarProps {
	currentStep: number;
}

const steps = ["Usuário", "Endereço", "Pedido", "Resumo"];

export const NewOrderProgressBar: React.FC<NewOrderProgressBarProps> = ({ currentStep }) => {
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
