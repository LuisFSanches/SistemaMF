import { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
import Modal from "react-modal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark, faQrcode, faCamera } from "@fortawesome/free-solid-svg-icons";
import {
    ModalContainer,
    ModalHeader,
    ModalBody,
    CloseButton,
    ScannerContainer,
    ScannerPreview,
    ScannerInfo,
    ActionButton
} from "./style";

Modal.setAppElement("#root");

interface QRCodeScannerProps {
    isOpen: boolean;
    onRequestClose: () => void;
    onScanSuccess: (decodedText: string) => void;
}

export function QRCodeScanner({
    isOpen,
    onRequestClose,
    onScanSuccess
}: QRCodeScannerProps) {
    const [isScanning, setIsScanning] = useState(false);
    const scannerRef = useRef<Html5Qrcode | null>(null);
    const [error, setError] = useState<string>("");

    useEffect(() => {
        if (isOpen) {
            startScanner();
        } else {
            stopScanner();
        }

        return () => {
            stopScanner();
        };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isOpen]);

    const startScanner = async () => {
        try {
            setError("");
            const scanner = new Html5Qrcode("qr-reader");
            scannerRef.current = scanner;

            await scanner.start(
                { facingMode: "environment" },
                {
                    fps: 10,
                    qrbox: { width: 250, height: 250 },
                },
                (decodedText) => {
                    onScanSuccess(decodedText);
                    stopScanner();
                    onRequestClose();
                },
                (errorMessage) => {
                    // Ignorar erros de "não encontrado" que ocorrem durante o scan
                    console.log(errorMessage);
                }
            );

            setIsScanning(true);
        } catch (err: any) {
            console.error("Erro ao iniciar scanner:", err);
            setError("Não foi possível acessar a câmera. Verifique as permissões.");
            setIsScanning(false);
        }
    };

    const stopScanner = async () => {
        if (scannerRef.current) {
            try {
                await scannerRef.current.stop();
                scannerRef.current.clear();
                scannerRef.current = null;
                setIsScanning(false);
            } catch (err) {
                console.error("Erro ao parar scanner:", err);
            }
        }
    };

    const handleClose = () => {
        stopScanner();
        onRequestClose();
    };

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={handleClose}
            overlayClassName="react-modal-overlay"
            className="react-modal-content"
        >
            <ModalContainer>
                <ModalHeader>
                    <div>
                        <FontAwesomeIcon icon={faQrcode as any} />
                        <span>Escanear QR Code</span>
                    </div>
                    <CloseButton onClick={handleClose}>
                        <FontAwesomeIcon icon={faXmark as any} />
                    </CloseButton>
                </ModalHeader>

                <ModalBody>
                    <ScannerContainer>
                        <ScannerPreview id="qr-reader" />
                        
                        {!isScanning && !error && (
                            <ScannerInfo>
                                <FontAwesomeIcon icon={faCamera as any} size="3x" />
                                <p>Aguardando acesso à câmera...</p>
                            </ScannerInfo>
                        )}

                        {error && (
                            <ScannerInfo>
                                <p style={{ color: "#dc3545" }}>{error}</p>
                                <ActionButton onClick={startScanner}>
                                    Tentar Novamente
                                </ActionButton>
                            </ScannerInfo>
                        )}

                        {isScanning && (
                            <ScannerInfo>
                                <p>Aponte a câmera para o QR Code do produto</p>
                            </ScannerInfo>
                        )}
                    </ScannerContainer>
                </ModalBody>
            </ModalContainer>
        </Modal>
    );
}
