import { useState } from 'react';
import Modal from 'react-modal';
import moment from 'moment';
import { useSuccessMessage } from "../../contexts/SuccessMessageContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPrint, faXmark } from "@fortawesome/free-solid-svg-icons";
import { Loader } from "../../components/Loader";
import { ErrorAlert } from '../ErrorAlert';
import { CouponTemplate } from './CouponTemplate';
import { generateCouponPDF, generateCouponImage } from './pdfGenerator';
import { ICoupon } from '../../interfaces/coupon';
import { convertMoney } from '../../utils';
import {
    Container,
    ModalContainer,
    EditorSection,
    PreviewSection,
    FormGroup,
    InfoField,
    PreviewCoupon,
    PreviewContent,
    PrintButton,
    FormatSelector,
    FormatOption,
    TemplateSelector,
    TemplateOption
} from "./style";

type PrintFormat = 'pdf' | 'image';

interface GenerateCouponProps {
    isOpen: boolean;
    onRequestClose: () => void;
    coupon: ICoupon | null;
    elementId?: string;
}

const isNeverExpires = (coupon: ICoupon) => {
    const expirationDate = new Date(coupon.expiration_date);
    return expirationDate.getFullYear() >= 2099;
};

const formatDiscountText = (coupon: ICoupon) => {
    const discountValue = Number(coupon.discount_value);
    return coupon.discount_type === 'FIXED'
        ? convertMoney(discountValue)
        : `${discountValue}%`;
};

const formatValidityText = (coupon: ICoupon) => {
    if (isNeverExpires(coupon)) return 'Sem validade';
    return moment(coupon.expiration_date).format('DD/MM/YYYY');
};

const formatConditionsText = (coupon: ICoupon) => {
    const conditions: string[] = [];

    if (coupon.discount_type === 'PERCENTAGE' && coupon.max_discount_amount) {
        conditions.push(`Desconto máximo de ${convertMoney(Number(coupon.max_discount_amount))}`);
    }

    if (coupon.minimum_order_amount) {
        conditions.push(`Compra mínima de ${convertMoney(Number(coupon.minimum_order_amount))}`);
    }

    if (coupon.total_usage_limit || coupon.usage_limit_per_customer) {
        conditions.push('Cupom de uso limitado');
    }

    return conditions.join(' | ');
};

export function GenerateCoupon({
    isOpen,
    onRequestClose,
    coupon,
    elementId = 'coupon-to-print'
}: GenerateCouponProps) {
    const { showSuccess } = useSuccessMessage();

    const [templateBackground, setTemplateBackground] = useState('coupon_background_1.jpeg');
    const [printFormat, setPrintFormat] = useState<PrintFormat>('image');
    const [showLoader, setShowLoader] = useState(false);
    const [showError, setShowError] = useState(false);

    if (!coupon) return null;

    const discountText = formatDiscountText(coupon);
    const validityText = formatValidityText(coupon);
    const conditionsText = formatConditionsText(coupon);

    const generateCoupon = async () => {
        try {
            setShowLoader(true);

            if (printFormat === 'pdf') {
                await generateCouponPDF(elementId, `Cupom-${coupon.code}.pdf`);
            } else {
                await generateCouponImage(elementId, `Cupom-${coupon.code}.jpeg`);
            }

            showSuccess("Cupom gerado com sucesso!");
            setShowLoader(false);
            onRequestClose();
        } catch (error) {
            setShowLoader(false);
            setShowError(true);
            console.error('Erro ao gerar o cupom:', error);
        }
    };

    return (
        <Container>
            {showError &&
                <ErrorAlert message='Não foi possível gerar o cupom'/>
            }
            <Modal
                isOpen={isOpen}
                onRequestClose={onRequestClose}
                overlayClassName="react-modal-overlay"
                className="react-modal-content-wide"
                >
                    <button type="button" onClick={onRequestClose} className="modal-close">
                        <FontAwesomeIcon icon={faXmark}/>
                    </button>
                    <ModalContainer>
                        <EditorSection>
                            <h2>Imprimir Cupom {coupon.code}</h2>

                            <FormGroup>
                                <label>Desconto:</label>
                                <InfoField>{discountText}</InfoField>
                            </FormGroup>

                            {conditionsText && (
                                <FormGroup>
                                    <label>Condições:</label>
                                    <InfoField>{conditionsText}</InfoField>
                                </FormGroup>
                            )}

                            <div style={{ display: 'flex', gap: '15px' }}>
                                <FormGroup style={{ flex: 1 }}>
                                    <label>Código do Cupom:</label>
                                    <InfoField>{coupon.code}</InfoField>
                                </FormGroup>
                                <FormGroup style={{ flex: 1 }}>
                                    <label>Válido até:</label>
                                    <InfoField>{validityText}</InfoField>
                                </FormGroup>
                            </div>

                            <FormGroup>
                                <label>Formato de Impressão:</label>
                                <FormatSelector>
                                    <FormatOption
                                        onClick={() => setPrintFormat('pdf')}
                                        $isSelected={printFormat === 'pdf'}
                                    >
                                        PDF
                                    </FormatOption>
                                    <FormatOption
                                        onClick={() => setPrintFormat('image')}
                                        $isSelected={printFormat === 'image'}
                                    >
                                        Imagem
                                    </FormatOption>
                                </FormatSelector>
                            </FormGroup>

                            <FormGroup>
                                <label>Selecione o Template:</label>
                                <TemplateSelector>
                                    <TemplateOption
                                        onClick={() => setTemplateBackground('coupon_background_1.jpeg')}
                                        $isSelected={templateBackground === 'coupon_background_1.jpeg'}
                                    >
                                        <img src="/coupon_background_1.jpeg" alt="Template 1" />
                                        <span>Template 1</span>
                                    </TemplateOption>
                                    <TemplateOption
                                        onClick={() => setTemplateBackground('coupon_background_2.jpeg')}
                                        $isSelected={templateBackground === 'coupon_background_2.jpeg'}
                                    >
                                        <img src="/coupon_background_2.jpeg" alt="Template 2" />
                                        <span>Template 2</span>
                                    </TemplateOption>
                                    <TemplateOption
                                        onClick={() => setTemplateBackground('coupon_background_3.jpeg')}
                                        $isSelected={templateBackground === 'coupon_background_3.jpeg'}
                                    >
                                        <img src="/coupon_background_3.jpeg" alt="Template 3" />
                                        <span>Template 3</span>
                                    </TemplateOption>
                                </TemplateSelector>
                            </FormGroup>

                            <PrintButton onClick={generateCoupon}>
                                <FontAwesomeIcon icon={faPrint}/>
                                Imprimir
                            </PrintButton>
                        </EditorSection>

                        <PreviewSection>
                            <PreviewCoupon $backgroundImage={templateBackground}>
                                <PreviewContent>
                                    <div className="field-discount">{discountText}</div>
                                    {conditionsText && <div className="field-conditions">{conditionsText}</div>}
                                    <div className="field-code">{coupon.code}</div>
                                    <div className="field-validity">{validityText}</div>
                                </PreviewContent>
                            </PreviewCoupon>
                        </PreviewSection>
                    </ModalContainer>
            </Modal>

            {/* Cupom invisível para geração do PDF */}
            <div style={{ position: 'absolute', left: '-9999px', top: 0 }}>
                <CouponTemplate
                    discountText={discountText}
                    conditionsText={conditionsText}
                    code={coupon.code}
                    validityText={validityText}
                    backgroundImage={templateBackground}
                    elementId={elementId}
                />
            </div>

            <Loader show={showLoader} />
        </Container>
    )
}
