import { useState, useContext } from 'react';
import Modal from 'react-modal';
import { useSuccessMessage } from "../../contexts/SuccessMessageContext";
import { AuthContext } from '../../contexts/AuthContext';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope, faPrint, faXmark, faMapMarkerAlt } from "@fortawesome/free-solid-svg-icons";
import { faInstagram, faWhatsapp } from "@fortawesome/free-brands-svg-icons";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { Loader } from "../../components/Loader";
import { ErrorAlert } from '../ErrorAlert';
import { CardTemplate } from './CardTemplate';
import { generateCardPDF } from './pdfGenerator';
import { 
    Container, 
    Button, 
    ModalContainer, 
    EditorSection,
    PreviewSection,
    FormGroup,
    Input,
    TextArea,
    PreviewCard,
    PreviewContent,
    PrintButton,
    TemplateSelector,
    TemplateOption
} from "./style";

interface GenerateCardProps {
    // Props opcionais para controle externo do modal
    isOpen?: boolean;
    onRequestClose?: () => void;
    // Props para valores pré-preenchidos
    initialCardFrom?: string;
    initialCardTo?: string;
    initialCardMessage?: string;
    initialOrderCode?: string;
    // Props para controle de edição
    readOnly?: boolean;
    // Customização
    elementId?: string;
    showButton?: boolean;
}

export function GenerateCard({
    isOpen: externalIsOpen,
    onRequestClose: externalOnRequestClose,
    initialCardFrom = "",
    initialCardTo = "",
    initialCardMessage = "",
    initialOrderCode,
    readOnly = false,
    elementId = 'card-to-print',
    showButton = true
}: GenerateCardProps = {}) {
    const { showSuccess } = useSuccessMessage();
    const { storeData } = useContext(AuthContext);

    const [cardFrom, setCardFrom] = useState(initialCardFrom);
    const [cardTo, setCardTo] = useState(initialCardTo);
    const [cardMessage, setCardMessage] = useState(initialCardMessage);
    const [templateBackground, setTemplateBackground] = useState('card_background_1.png');
    const [showLoader, setShowLoader] = useState(false);
    const [showError, setShowError] = useState(false);
    const [internalIsOpen, setInternalIsOpen] = useState(false);

    const logoSrc = storeData?.logo_base64 || '';
    const instagram = storeData?.instagram;
    const phoneNumber = storeData?.phone_number;
    const referencePoint = storeData?.addresses?.[0]?.reference_point;

    // Controle do modal: usa externo se fornecido, senão usa interno
    const isOpen = externalIsOpen !== undefined ? externalIsOpen : internalIsOpen;
    const handleClose = externalOnRequestClose || (() => setInternalIsOpen(false));

    const generatePDF = async () => {
        try {
            setShowLoader(true);
            
            const filename = initialOrderCode 
                ? `#${initialOrderCode}-${cardFrom}- Cartão de mensagem.pdf`
                : `Cartão de mensagem.pdf`;
            
            await generateCardPDF(elementId, filename);
            
            showSuccess("Cartão gerado com sucesso!");
            setShowLoader(false);
            handleClose();
        } catch (error) {
            setShowLoader(false);
            setShowError(true);
            console.error('Erro ao gerar o PDF:', error);
        }
    };

    return (
        <Container>
            {showError &&
                <ErrorAlert message='Não foi possível gerar o PDF'/>
            }
            <Modal 
                isOpen={isOpen}
                onRequestClose={handleClose}
                overlayClassName="react-modal-overlay"
                className="react-modal-content-wide"
                >
                    <button type="button" onClick={handleClose} className="modal-close">
                        <FontAwesomeIcon icon={faXmark}/>
                    </button>
                    <ModalContainer>
                        <EditorSection>
                            <h2>
                                {initialOrderCode 
                                    ? `Imprimir Cartão do Pedido #${initialOrderCode}` 
                                    : 'Personalizar Cartão'}
                            </h2>
                            
                            <FormGroup>
                                <label>De:</label>
                                <Input
                                    value={cardFrom}
                                    onChange={(e) => setCardFrom(e.target.value)}
                                    placeholder="Quem está enviando"
                                    readOnly={readOnly}
                                    disabled={readOnly}
                                    style={readOnly ? { backgroundColor: '#f5f5f5', cursor: 'not-allowed' } : {}}
                                />
                            </FormGroup>

                            <FormGroup>
                                <label>Para:</label>
                                <Input
                                    value={cardTo}
                                    onChange={(e) => setCardTo(e.target.value)}
                                    placeholder="Para quem é o cartão"
                                    readOnly={readOnly}
                                    disabled={readOnly}
                                    style={readOnly ? { backgroundColor: '#f5f5f5', cursor: 'not-allowed' } : {}}
                                />
                            </FormGroup>

                            <FormGroup>
                                <label>Mensagem:</label>
                                <TextArea
                                    value={cardMessage}
                                    onChange={(e) => setCardMessage(e.target.value)}
                                    placeholder="Digite sua mensagem aqui..."
                                    readOnly={readOnly}
                                    disabled={readOnly}
                                    style={readOnly ? { backgroundColor: '#f5f5f5', cursor: 'not-allowed' } : {}}
                                />
                            </FormGroup>

                            <FormGroup>
                                <label>Selecione o Template:</label>
                                <TemplateSelector>
                                    <TemplateOption 
                                        onClick={() => setTemplateBackground('card_background_1.png')}
                                        $isSelected={templateBackground === 'card_background_1.png'}
                                    >
                                        <img src="/card_background_1.png" alt="Template 1" />
                                        <span>Template 1</span>
                                    </TemplateOption>
                                    <TemplateOption 
                                        onClick={() => setTemplateBackground('card_background_2.png')}
                                        $isSelected={templateBackground === 'card_background_2.png'}
                                    >
                                        <img src="/card_background_2.png" alt="Template 2" />
                                        <span>Template 2</span>
                                    </TemplateOption>
                                    <TemplateOption 
                                        onClick={() => setTemplateBackground('card_background_3.png')}
                                        $isSelected={templateBackground === 'card_background_3.png'}
                                    >
                                        <img src="/card_background_3.png" alt="Template 3" />
                                        <span>Template 3</span>
                                    </TemplateOption>
                                </TemplateSelector>
                            </FormGroup>

                            <PrintButton onClick={generatePDF}>
                                <FontAwesomeIcon icon={faPrint}/>
                                Imprimir
                            </PrintButton>
                        </EditorSection>

                        <PreviewSection>
                            <PreviewCard $backgroundImage={templateBackground}>
                                <PreviewContent fontSize={16}>
                                    <img src={logoSrc} alt="Logo" className="logo-top"/>
                                    {cardFrom && <div className="card-from">De: {cardFrom}</div>}
                                    {cardTo && <div className="card-to">Para: {cardTo}</div>}
                                    {cardMessage && <div className="card-message">{cardMessage}</div>}
                                    {!cardTo && !cardMessage && !cardFrom && !readOnly && (
                                        <div style={{ color: '#999', fontStyle: 'italic' }}>
                                            Preencha os campos para visualizar o cartão
                                        </div>
                                    )}
                                    <div className="bottom-section">
                                        <img src={logoSrc} alt="Logo" className="logo-bottom"/>
                                        <div className="store-info">
                                            {instagram && (
                                                <div className="store-info-item">
                                                    <FontAwesomeIcon icon={faInstagram as IconProp} />
                                                    <span>@{instagram}</span>
                                                </div>
                                            )}
                                            {phoneNumber && (
                                                <div className="store-info-item">
                                                    <FontAwesomeIcon icon={faWhatsapp as IconProp} />
                                                    <span>{phoneNumber}</span>
                                                </div>
                                            )}
                                            {referencePoint && (
                                                <div className="store-info-item">
                                                    <FontAwesomeIcon icon={faMapMarkerAlt} />
                                                    <span>{referencePoint}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </PreviewContent>
                            </PreviewCard>
                        </PreviewSection>
                    </ModalContainer>
            </Modal>

            {/* Cartão invisível para geração do PDF */}
            <div style={{ position: 'absolute', left: '-9999px', top: 0 }}>
                <CardTemplate
                    cardFrom={cardFrom}
                    cardTo={cardTo}
                    cardMessage={cardMessage}
                    fontSize={16}
                    logo={logoSrc}
                    backgroundImage={templateBackground}
                    elementId={elementId}
                    instagram={instagram}
                    phoneNumber={phoneNumber}
                    referencePoint={referencePoint}
                />
            </div>

            <Loader show={showLoader} />
            {showButton && (
                <Button onClick={() => setInternalIsOpen(true)}>
                    <FontAwesomeIcon icon={faEnvelope}/>
                    Gerar Cartão
                </Button>
            )}
        </Container>
    )
}
