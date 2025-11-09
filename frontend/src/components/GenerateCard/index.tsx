import { useState } from 'react';
import fontkit from '@pdf-lib/fontkit';
import Modal from 'react-modal';
import { useSuccessMessage } from "../../contexts/SuccessMessageContext";
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope, faPrint, faXmark } from "@fortawesome/free-solid-svg-icons";
import { Loader } from "../../components/Loader";
import { ErrorAlert } from '../ErrorAlert';
import { Container, Button, ModalContainer, TextArea } from "./style";

const pdfModel = `./cartao_limpo.pdf`;
const emojiFontVariable = `./noto_emoji_variable.ttf`;

export function GenerateCard() {
    const { showSuccess } = useSuccessMessage();

    const emojiRegex = /\p{Emoji}/u;
    const [cardMessage, setCardMessage] = useState("");
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
        let isEmoji = emojiRegex.test(text[0]);

        for (const char of text) {
            const charIsEmoji = emojiRegex.test(char);
            if (charIsEmoji === isEmoji) {
                currentSegment += char;
            } else {
                segments.push({ text: currentSegment, isEmoji });
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

    function wrapText(text: string, maxLength: number) {
        const lines = [];
        while (text.length > 0) {
            if (text.length <= maxLength) {
                lines.push(text);
                break;
            }
            let breakPoint = text.lastIndexOf(' ', maxLength);
            if (breakPoint === -1) breakPoint = maxLength;
            lines.push(text.slice(0, breakPoint));
            text = text.slice(breakPoint).trim();
        }
        return lines;
    }

    function wrapMultilineText(text: string, maxLineLength: number): string[] {
        const rawLines = text.split('\n');
        const wrappedLines = rawLines.flatMap(line => wrapText(line.trim(), maxLineLength));
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
            pdfDoc.setTitle(`Cartão de mensagem`);

            pdfDoc.registerFontkit(fontkit);

            const regularFont = await pdfDoc.embedFont(StandardFonts.TimesRomanItalic);
            const emojiFont = await pdfDoc.embedFont(emojiFontBytes);
            const lineHeight = 24; 

            const pages = pdfDoc.getPages();
            const firstPage = pages[0];

            const sanitizedCardMessage = sanitizeText(cardMessage);
            const message_formatted = wrapMultilineText(sanitizedCardMessage, 65);
            message_formatted.forEach((line, index) => {
                write(true, firstPage, regularFont, emojiFont, line, 120, (710 - (index * lineHeight)), 14);
            });

            const pdfOutput = await pdfDoc.save();
            const blob = new Blob([pdfOutput as any], { type: 'application/pdf' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `Cartão de mensagem.pdf`;
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
                <ErrorAlert message='Não foi possível gerar o PDF'/>
            }
            <Modal 
                isOpen={isOpen}
                onRequestClose={() => setIsOpen(false)}
                overlayClassName="react-modal-overlay"
                className="react-modal-content"
                >
                    <button type="button" onClick={() => setIsOpen(false)} className="modal-close">
                        <FontAwesomeIcon icon={faXmark}/>
                    </button>
                    <ModalContainer>
                        <h2>Cole o conteúdo do cartão</h2>
                        <TextArea
                            onChange={(e) => setCardMessage(e.target.value)}
                            placeholder="Cole o conteúdo do cartão aqui."
                        />
                        <Button onClick={generatePDF}>
                            <FontAwesomeIcon icon={faPrint}/>
                            Gerar
                        </Button>
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