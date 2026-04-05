import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const GTM_ID = 'GTM-KCMG8MBX';

// Declarar o dataLayer global
declare global {
    interface Window {
        dataLayer: any[];
    }
}

export function GTMLoader() {
    const location = useLocation();

    useEffect(() => {
        // Não carregar GTM em rotas do backoffice
        const isBackoffice = location.pathname.startsWith('/backoffice');
        
        if (isBackoffice) {
            return;
        }

        if (window.dataLayer) {
            return;
        }

        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push({
            'gtm.start': new Date().getTime(),
            event: 'gtm.js'
        });

        const script = document.createElement('script');
        script.async = true;
        script.src = `https://www.googletagmanager.com/gtm.js?id=${GTM_ID}`;
        document.head.insertBefore(script, document.head.firstChild);

        const noscript = document.createElement('noscript');
        const iframe = document.createElement('iframe');
        iframe.src = `https://www.googletagmanager.com/ns.html?id=${GTM_ID}`;
        iframe.height = '0';
        iframe.width = '0';
        iframe.style.display = 'none';
        iframe.style.visibility = 'hidden';
        noscript.appendChild(iframe);
        document.body.insertBefore(noscript, document.body.firstChild);

        console.log('GTM carregado com sucesso');

    }, [location.pathname]);

    return null;
}
