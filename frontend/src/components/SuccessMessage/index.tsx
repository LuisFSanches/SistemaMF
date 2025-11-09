import { useEffect, useState } from 'react';
import { Container } from './style';

interface ISuccessMessageProps {
    message: string;
    onClose: () => void;
    duration?: number;
}

export function SuccessMessage({ message, onClose, duration = 4000 }: ISuccessMessageProps) {
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(false);
            setTimeout(onClose, 300);
        }, duration);

        return () => clearTimeout(timer);
    }, [duration, onClose]);

    const handleClose = () => {
        setIsVisible(false);
        setTimeout(onClose, 300);
    };

    return (
        <Container $isVisible={isVisible}>
            <i className="material-icons icon">check_circle</i>
            <div className="content">
                <p>{message}</p>
            </div>
            <button className="close-button" onClick={handleClose} type="button">
                <i className="material-icons">close</i>
            </button>
        </Container>
    );
}
