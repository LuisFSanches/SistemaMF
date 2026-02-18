import {
    StepperContainer,
    StepperWrapper,
    Step,
    StepCircle,
    StepLabel,
    StepSubLabel
} from './style';

export type OrderStatusStep = 'validating' | 'approved' | 'in_progress' | 'in_delivery' | 'done';

interface OrderStatusStepperProps {
    currentStep: OrderStatusStep;
}

const steps: { key: OrderStatusStep; label: string; subLabel: string }[] = [
    { key: 'validating', label: 'Validando Pagamento', subLabel: 'Processando' },
    { key: 'approved', label: 'Pedido Recebido', subLabel: 'Confirmado' },
    { key: 'in_progress', label: 'Em Produção', subLabel: 'Preparando' },
    { key: 'in_delivery', label: 'Em Rota', subLabel: 'A caminho' },
    { key: 'done', label: 'Entregue', subLabel: 'Concluído' }
];

export function OrderStatusStepper({ currentStep }: OrderStatusStepperProps) {
    const currentStepIndex = steps.findIndex(step => step.key === currentStep);

    return (
        <StepperContainer>
            <StepperWrapper>
                {steps.map((step, index) => {
                    const isActive = index === currentStepIndex;
                    const isCompleted = index < currentStepIndex;
                    
                    return (
                        <Step 
                            key={step.key} 
                            active={isActive} 
                            completed={isCompleted}
                        >
                            <StepCircle active={isActive} completed={isCompleted}>
                                {isCompleted ? '✓' : index + 1}
                            </StepCircle>
                            <StepLabel active={isActive}>{step.label}</StepLabel>
                            <StepSubLabel>{step.subLabel}</StepSubLabel>
                        </Step>
                    );
                })}
            </StepperWrapper>
        </StepperContainer>
    );
}
