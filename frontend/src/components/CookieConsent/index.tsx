import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
    ConsentOverlay,
    ConsentContainer,
    ConsentContent,
    ConsentTitle,
    ConsentText,
    ConsentLink,
    ConsentButton
} from "./style";

const COOKIE_NAME = "cookie_consent_accepted";
const COOKIE_EXPIRY_DAYS = 90;

// Função para definir cookie
const setCookie = (name: string, value: string, days: number) => {
    const date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    const expires = `expires=${date.toUTCString()}`;
    document.cookie = `${name}=${value};${expires};path=/`;
};

// Função para obter cookie
const getCookie = (name: string): string | null => {
    const nameEQ = `${name}=`;
    const ca = document.cookie.split(";");
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === " ") c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
};

export function CookieConsent() {
    const navigate = useNavigate();
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Verificar se o cookie de consentimento existe
        const consentCookie = getCookie(COOKIE_NAME);
        
        if (!consentCookie) {
            setIsVisible(true);
        }
    }, []);

    const handleAccept = () => {
        setCookie(COOKIE_NAME, "true", COOKIE_EXPIRY_DAYS);
        setIsVisible(false);
    };

    const handlePrivacyPolicyClick = (e: React.MouseEvent) => {
        e.preventDefault();
        navigate("/politica-de-privacidade");
    };

    if (!isVisible) {
        return null;
    }

    return (
        <ConsentOverlay>
            <ConsentContainer>
                <ConsentContent>
                    <ConsentTitle>Este website utiliza cookies</ConsentTitle>
                    <ConsentText>
                        Utilizamos cookies para melhorar sua experiência. Saiba mais acessando nossa{" "}
                        <ConsentLink onClick={handlePrivacyPolicyClick}>
                            Política de Privacidade
                        </ConsentLink>
                    </ConsentText>
                </ConsentContent>
                <ConsentButton onClick={handleAccept}>
                    Ciente
                </ConsentButton>
            </ConsentContainer>
        </ConsentOverlay>
    );
}
