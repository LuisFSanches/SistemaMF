import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export const generateCouponPDF = async (elementId: string, filename: string): Promise<void> => {
    // Aguarda um pequeno delay para garantir que o React atualizou o DOM
    await new Promise(resolve => setTimeout(resolve, 100));

    const element = document.getElementById(elementId);

    if (!element) {
        throw new Error('Elemento não encontrado para gerar PDF');
    }

    // Aguardar o carregamento de todas as imagens dentro do elemento
    const images = element.querySelectorAll('img');
    await Promise.all(
        Array.from(images).map((img) => {
            if (img.complete) return Promise.resolve();
            return new Promise((resolve, reject) => {
                img.onload = resolve;
                img.onerror = reject;
            });
        })
    );

    // Renderiza o elemento HTML como imagem com alta qualidade
    const canvas = await html2canvas(element, {
        scale: 1,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        logging: false,
        width: 1024,
        height: 1536
    });

    const imgData = canvas.toDataURL('image/png');

    // Cria PDF com dimensões exatas do cupom
    const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'px',
        format: [1024, 1536]
    });

    // Adiciona a imagem renderizada ao PDF
    pdf.addImage(imgData, 'PNG', 0, 0, 1024, 1536);

    // Faz o download do PDF
    pdf.save(filename);
};
