import { useState } from "react";
import Modal from 'react-modal';
import { Container, WhatsappButton, CopyContainer } from "./style";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { faWhatsapp } from "@fortawesome/free-brands-svg-icons";

interface ITooltipModal {
    isOpen: boolean;
    onRequestClose: () => void;
    textContent: string;
    title: string;
    showWhatsapp: boolean
    showCopyButton: boolean
}

export function TooltipModal({
    isOpen,
    onRequestClose,
    textContent,
    title,
    showWhatsapp,
    showCopyButton
}: ITooltipModal) {
    const [copied, setCopied] = useState(false);
    const handleCopy = () => {
        navigator.clipboard.writeText(textContent).then(() => {
            setCopied(true);
            setTimeout(() => {
                setCopied(false);
            }, 2000);
        });
    };

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onRequestClose}
            overlayClassName="react-modal-overlay"
            className="react-modal-content"
        >
            <button
                style={{ top: "1rem" }}
                type="button"
                onClick={onRequestClose}
                className="modal-close">
                <FontAwesomeIcon icon={faXmark}/>
            </button>
            <Container>
                <h2>{title}</h2>
                {showCopyButton &&
                    <CopyContainer>
                        <button
                            type="button"
                            onClick={handleCopy}
                            style={{
                                padding: "4px 8px",
                                backgroundColor: "#e7b7c2",
                                border: "none",
                                borderRadius: "4px",
                                cursor: "pointer",
                                color: 'white',
                                fontSize: '15px',
                                alignContent: 'center'
                            }}
                        >
                            Copiar texto
                        </button>
                        {copied && (
                            <span style={{ color: "gray", fontWeight: "300", marginLeft: '10px' }}>
                                Texto copiado!
                            </span>
                        )}
                    </CopyContainer>
                }
                <p style={{ whiteSpace: "pre-line" }}>{textContent}</p>
                {showWhatsapp &&
                    <WhatsappButton href="https://wa.me//5522997517940?text=Poderia%20me%20ajudar%20?" target="_blank">
                        <FontAwesomeIcon icon={faWhatsapp as any}/>
                        Saber mais
                    </WhatsappButton>
                }
            </Container>
        </Modal>
    );
}