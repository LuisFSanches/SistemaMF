import { useState } from 'react';
import fontkit from '@pdf-lib/fontkit';
import Modal from 'react-modal';
import { useSuccessMessage } from "../../contexts/SuccessMessageContext";
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope, faPrint, faXmark, faMinus, faPlus } from "@fortawesome/free-solid-svg-icons";
import { Loader } from "../../components/Loader";
import { ErrorAlert } from '../ErrorAlert';
import { 
    Container, 
    Button, 
    ModalContainer, 
    EditorSection,
    PreviewSection,
    FormGroup,
    Input,
    TextArea,
    FontSizeControl,
    PreviewCard,
    PreviewContent,
    PrintButton
} from "./style";

const pdfModel = `${process.env.PUBLIC_URL}/cartao_limpo.pdf`;
const emojiFontVariable = `${process.env.PUBLIC_URL}/noto_emoji_variable.ttf`;

export function GenerateCard() {
    const { showSuccess } = useSuccessMessage();

    const emojiRegex = /\p{Emoji}/u;
    const [cardFrom, setCardFrom] = useState("");
    const [cardTo, setCardTo] = useState("");
    const [cardMessage, setCardMessage] = useState("");
    const [fontSize, setFontSize] = useState(15);
    const [showLoader, setShowLoader] = useState(false);
    const [showError, setShowError] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    function sanitizeText(input: string) {
        return input
            .replace(/[\u2028\u2029\u2060\uFEFF\uFE0F]/g, '')
            .replace(/\u00A0/g, ' ')
            .replace(/\r\n|\r|\n/g, '\n')
            .trim();
    }

    function splitTextByFont(text: string) {
        const segments = [];
        let currentSegment = '';
        let isEmoji = false;

        if (text.length > 0) {
            isEmoji = emojiRegex.test(text[0]) && text[0].codePointAt(0)! > 255;
        }

        for (const char of text) {
            const charIsEmoji = emojiRegex.test(char) && char.codePointAt(0)! > 255;
            if (charIsEmoji === isEmoji) {
                currentSegment += char;
            } else {
                if (currentSegment) {
                    segments.push({ text: currentSegment, isEmoji });
                }
                currentSegment = char;
                isEmoji = charIsEmoji;
            }
        }
        if (currentSegment) {
            segments.push({ text: currentSegment, isEmoji });
        }

        return segments;
    }

    const write = (
        split: boolean,
        page: any,
        regularFont: any,
        emojiFont: any,
        text: string,
        x: number,
        y: number,
        size: number
    ) => {
        if (split) {
            const segments = splitTextByFont(text);
            let currentX = x;

            segments.forEach(({ text, isEmoji }) => {
                page.drawText(text, {
                    x: currentX,
                    y,
                    size,
                    font: isEmoji ? emojiFont : regularFont,
                    color: rgb(0, 0, 0),
                });

                currentX += (isEmoji ?
                    emojiFont.widthOfTextAtSize(text, size) : regularFont.widthOfTextAtSize(text, size));
            });
        }

        if (!split) {
            page.drawText(text, {
                x,
                y,
                size,
                font: regularFont,
                color: rgb(0, 0, 0),
            });
        }
    };

    function wrapTextByWidth(text: string, font: any, fontSize: number, maxWidth: number) {
        const lines = [];
        const words = text.split(' ');
        let currentLine = '';

        for (const word of words) {
            const testLine = currentLine ? `${currentLine} ${word}` : word;
            const testWidth = font.widthOfTextAtSize(testLine, fontSize);

            if (testWidth > maxWidth && currentLine) {
                lines.push(currentLine);
                currentLine = word;
            } else {
                currentLine = testLine;
            }
        }

        if (currentLine) {
            lines.push(currentLine);
        }

        return lines;
    }

    function wrapMultilineText(text: string, font: any, fontSize: number, maxWidth: number): string[] {
        const rawLines = text.split('\n');
        const wrappedLines = rawLines.flatMap(line => 
            line.trim() ? wrapTextByWidth(line.trim(), font, fontSize, maxWidth) : ['']
        );
        return wrappedLines;
    }

    const generatePDF = async () => {
        try {
            setShowLoader(true);
            const [pdfBytes, emojiFontBytes] = await Promise.all([
                fetch(pdfModel).then((res) => res.arrayBuffer()),
                fetch(emojiFontVariable).then((res) => res.arrayBuffer()),
            ]);
            
            const pdfDoc = await PDFDocument.load(pdfBytes);
            pdfDoc.setAuthor('Mirai Flores');
            pdfDoc.setTitle(`Cartão de mensagem`);

            pdfDoc.registerFontkit(fontkit);

            const regularFont = await pdfDoc.embedFont(StandardFonts.TimesRomanItalic);
            const emojiFont = await pdfDoc.embedFont(emojiFontBytes);
            const lineHeight = fontSize * 1.6; // Altura da linha proporcional ao tamanho da fonte
            const maxWidth = 400; // Largura máxima disponível no PDF (595 - 120 de margem esquerda - 40 de margem direita)

            const pages = pdfDoc.getPages();
            const firstPage = pages[0];
            let currentY = 710;
            
            // Adicionar "De" se existir
            if (cardFrom) {
                const sanitizedFrom = sanitizeText(`De: ${cardFrom}`);
                write(true, firstPage, regularFont, emojiFont, sanitizedFrom, 100, currentY, fontSize);
            }

            // Adicionar "Para" se existir

            if (cardTo) {
                const sanitizedTo = sanitizeText(`Para: ${cardTo}`);
                write(true, firstPage, regularFont, emojiFont, sanitizedTo, 100, 685, fontSize);
                currentY -= lineHeight * 2;
            }

            // Adicionar mensagem
            if (cardMessage) {
                const sanitizedCardMessage = sanitizeText(cardMessage);
                const message_formatted = wrapMultilineText(sanitizedCardMessage, regularFont, fontSize, maxWidth);
                message_formatted.forEach((line, index) => {
                    write(true, firstPage, regularFont, emojiFont, line, 100, (650 - (index * lineHeight)), fontSize);
                });
                currentY -= (message_formatted.length * lineHeight) + lineHeight;
            }

            const pdfOutput = await pdfDoc.save();
            const blob = new Blob([pdfOutput as any], { type: 'application/pdf' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `Cartão de mensagem.pdf`;
            link.click();
            URL.revokeObjectURL(url);
            showSuccess("Cartão gerado com sucesso!");
            setShowLoader(false);

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
                onRequestClose={() => setIsOpen(false)}
                overlayClassName="react-modal-overlay"
                className="react-modal-content-wide"
                >
                    <button type="button" onClick={() => setIsOpen(false)} className="modal-close">
                        <FontAwesomeIcon icon={faXmark}/>
                    </button>
                    <ModalContainer>
                        <EditorSection>
                            <h2>Personalizar Cartão</h2>
                            
                            <FormGroup>
                                <label>De:</label>
                                <Input
                                    value={cardFrom}
                                    onChange={(e) => setCardFrom(e.target.value)}
                                    placeholder="Quem está enviando"
                                />
                            </FormGroup>

                            <FormGroup>
                                <label>Para:</label>
                                <Input
                                    value={cardTo}
                                    onChange={(e) => setCardTo(e.target.value)}
                                    placeholder="Para quem é o cartão"
                                />
                            </FormGroup>

                            <FormGroup>
                                <label>Mensagem:</label>
                                <TextArea
                                    value={cardMessage}
                                    onChange={(e) => setCardMessage(e.target.value)}
                                    placeholder="Digite sua mensagem aqui..."
                                />
                            </FormGroup>

                            <FormGroup>
                                <label>Tamanho da Fonte: {fontSize}px</label>
                                <FontSizeControl>
                                    <button onClick={() => setFontSize(Math.max(12, fontSize - 2))}>
                                        <FontAwesomeIcon icon={faMinus} />
                                    </button>
                                    <input 
                                        type="range" 
                                        min="12" 
                                        max="48" 
                                        value={fontSize}
                                        onChange={(e) => setFontSize(Number(e.target.value))}
                                        style={{ flex: 1 }}
                                    />
                                    <button onClick={() => setFontSize(Math.min(48, fontSize + 2))}>
                                        <FontAwesomeIcon icon={faPlus} />
                                    </button>
                                </FontSizeControl>
                            </FormGroup>

                            <PrintButton onClick={generatePDF}>
                                <FontAwesomeIcon icon={faPrint}/>
                                Imprimir
                            </PrintButton>
                        </EditorSection>

                        <PreviewSection>
                            <PreviewCard>
                                <PreviewContent fontSize={fontSize}>
                                    {cardFrom && <div className="card-from">De: {cardFrom}</div>}
                                    {cardTo && <div className="card-to">Para: {cardTo}</div>}
                                    {cardMessage && <div className="card-message">{cardMessage}</div>}
                                    {!cardTo && !cardMessage && !cardFrom && (
                                        <div style={{ color: '#999', fontStyle: 'italic' }}>
                                            Preencha os campos para visualizar o cartão
                                        </div>
                                    )}
                                </PreviewContent>
                            </PreviewCard>
                        </PreviewSection>
                    </ModalContainer>
            </Modal>
            <Loader show={showLoader} />
            <Button onClick={() => setIsOpen(true)}>
                <FontAwesomeIcon icon={faEnvelope}/>
                Gerar Cartão
            </Button>
        </Container>
    )
}
