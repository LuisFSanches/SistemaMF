import {
    CouponWrapper,
    DiscountField,
    ConditionsField,
    CodeField,
    ValidityField
} from './style';

interface CouponTemplateProps {
    discountText: string;
    conditionsText?: string;
    code: string;
    validityText: string;
    backgroundImage?: string;
    elementId?: string;
}

export const CouponTemplate = ({
    discountText,
    conditionsText,
    code,
    validityText,
    backgroundImage = 'coupon_background_1.png',
    elementId = 'coupon-to-print'
}: CouponTemplateProps) => {
    return (
        <CouponWrapper id={elementId} $backgroundImage={backgroundImage}>
            <DiscountField>{discountText}</DiscountField>
            {conditionsText && <ConditionsField>{conditionsText}</ConditionsField>}
            <CodeField>{code}</CodeField>
            <ValidityField>{validityText}</ValidityField>
        </CouponWrapper>
    );
};
