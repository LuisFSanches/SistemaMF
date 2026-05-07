import { useState, useEffect } from "react";
import Modal from "react-modal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import {
    ModalContent,
    BackgroundImage,
} from "./style";

const MOTHERS_DAY_POPUP_KEY = "mothers_day_popup_2026_shown";

export function MothersDayPopup() {
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        // Verificar se o popup já foi exibido
        const hasBeenShown = localStorage.getItem(MOTHERS_DAY_POPUP_KEY);
        
        if (!hasBeenShown) {
            // Pequeno delay para melhor UX
            const timer = setTimeout(() => {
                setIsOpen(true);
            }, 1000);

            return () => clearTimeout(timer);
        }
    }, []);

    const handleClose = () => {
        localStorage.setItem(MOTHERS_DAY_POPUP_KEY, "true");
        setIsOpen(false);
    };

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={handleClose}
            overlayClassName="react-modal-overlay"
            className="react-modal-content mothers-day-modal"
            ariaHideApp={false}
        >
            <button type="button" onClick={handleClose} className="modal-close">
                <FontAwesomeIcon icon={faXmark} />
            </button>

            <ModalContent>
                <BackgroundImage />
            </ModalContent>
        </Modal>
    );
}
