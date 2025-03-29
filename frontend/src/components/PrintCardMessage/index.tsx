import { useState } from 'react';
import fontkit from '@pdf-lib/fontkit';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Loader } from "../../components/Loader";
import { ErrorAlert } from '../ErrorAlert';
import { faPrint } from "@fortawesome/free-solid-svg-icons";

import { Button } from "./style";

const pdfModel = `./pdf_model.pdf`;
const emojiFontVariable = `./noto_emoji_variable.ttf`;

export const PrintCardMessage = ({ card_message, card_from, card_to, order_code }: any) => {
    const emojiRegex = /\p{Emoji}/u;
    const [showLoader, setShowLoader] = useState(false);
    const [showError, setShowError] = useState(false);

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
            pdfDoc.setTitle(`${order_code} ${card_from}- Cartão de mensagem`);

            pdfDoc.registerFontkit(fontkit);

            const regularFont = await pdfDoc.embedFont(StandardFonts.TimesRomanItalic);
            const emojiFont = await pdfDoc.embedFont(emojiFontBytes);
            const maxLineLength = 54;
            const lineHeight = 18; 

            const pages = pdfDoc.getPages();
            const firstPage = pages[0];

            const card_from_formatted = wrapText(card_from, maxLineLength);
            card_from_formatted.forEach((line, index) => {
                write(true, firstPage, regularFont, emojiFont, line, 160, (692 - (index * lineHeight)), 14);
            });

            const card_to_formatted = wrapText(card_to, maxLineLength);
            card_to_formatted.forEach((line, index) => {
                write(true, firstPage, regularFont, emojiFont, line, 165, (658 - (index * lineHeight)), 14);
            });

            const message_formatted = wrapMultilineText(card_message, 65);
            message_formatted.forEach((line, index) => {
                write(true, firstPage, regularFont, emojiFont, line, 120, (620 - (index * lineHeight)), 14);
            });

            const order_code_message = `Pedido #${order_code}`;

            write(false, firstPage, regularFont, emojiFont, order_code_message, 240, 10, 13);

            const pdfOutput = await pdfDoc.save();
            const blob = new Blob([pdfOutput], { type: 'application/pdf' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `#${order_code}-${card_from}- Cartão de mensagem.pdf`;
            link.click();
            URL.revokeObjectURL(url);
            setShowLoader(false);

        } catch (error) {
            setShowLoader(false);
            setShowError(true);
            console.error('Erro ao gerar o PDF:', error);
        }
    };

    return (
        <>
            <Loader show={showLoader} />
            {showError &&
                <ErrorAlert message='Não foi possível gerar o PDF'/>
            }
            <Button onClick={generatePDF}>
                <FontAwesomeIcon icon={faPrint}/>
                Imprimir Cartão
            </Button>
        </>
    );
};
