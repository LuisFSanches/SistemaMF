import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export const generateCardPDF = async (elementId: string, filename: string): Promise<void> => {
    const element = document.getElementById(elementId);
    
    if (!element) {
        throw new Error('Elemento não encontrado para gerar PDF');
    }

    // Aguardar o carregamento de todas as imagens dentro do elemento
    const images = element.querySelectorAll('img');
    await Promise.all(
        Array.from(images).map((img, index) => {
            if (img.complete) {
                return Promise.resolve();
            }
            return new Promise<void>((resolve, reject) => {
                img.onload = () => {
                    resolve();
                };
                img.onerror = () => {
                    console.error(`Image ${index} failed to load`);
                    reject(new Error(`Image ${index} failed to load`));
                };
                // Timeout de segurança de 5 segundos
                setTimeout(() => {
                    resolve();
                }, 5000);
            });
        })
    );

    // Aguardar carregamento de fontes
    if (document.fonts && document.fonts.ready) {
        await document.fonts.ready;
    }

    // Delay adicional para garantir renderização completa do DOM
    await new Promise(resolve => setTimeout(resolve, 500));

    // Forçar um reflow para garantir que o elemento está renderizado
    element.style.display = 'block';
    element.style.visibility = 'visible';
    
    // Garantir que o elemento tem conteúdo visível
    const hasContent = element.textContent && element.textContent.trim().length > 0;
    
    if (!hasContent) {
        console.error('ERRO: Elemento sem conteúdo visível detectado');
        throw new Error('Elemento não contém conteúdo para gerar o PDF');
    }

    // Renderiza o elemento HTML como imagem com alta qualidade
    const canvas = await html2canvas(element, {
        scale: 2, // 2x de resolução para melhor qualidade
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        logging: true, // Ativar logging para debug
        width: 595,
        height: 830,
        foreignObjectRendering: false, // Melhor compatibilidade com fontes e emojis
        imageTimeout: 15000, // Aumentar timeout para imagens
        onclone: (clonedDoc) => {
            // Garantir que o elemento clonado está visível e posicionado corretamente
            const clonedElement = clonedDoc.getElementById(elementId);
            if (clonedElement) {
                clonedElement.style.position = 'relative';
                clonedElement.style.left = '0';
                clonedElement.style.top = '0';
                clonedElement.style.display = 'block';
                clonedElement.style.visibility = 'visible';
            } else {
                console.error('Failed to find cloned element with ID:', elementId);
            }
        }
    });

    // Verificar se o canvas foi gerado corretamente
    if (canvas.width === 0 || canvas.height === 0) {
        console.error('ERRO: Canvas gerado está vazio');
        throw new Error('Canvas gerado está vazio. Verifique o conteúdo do elemento.');
    }

    const imgData = canvas.toDataURL('image/png');
    
    // Verificar se a imagem foi gerada
    if (!imgData || imgData === 'data:,') {
        console.error('ERRO: Falha ao gerar imagem do canvas');
        throw new Error('Falha ao gerar imagem do canvas');
    }
    
    // Cria PDF com dimensões exatas do cartão (A4 portrait em pixels)
    const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'px',
        format: [595, 822]
    });

    // Adiciona a imagem renderizada ao PDF
    pdf.addImage(imgData, 'PNG', 0, 0, 595, 822);
    
    // Faz o download do PDF
    pdf.save(filename);
};
