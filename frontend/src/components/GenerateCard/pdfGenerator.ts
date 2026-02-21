import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export const generateCardPDF = async (elementId: string, filename: string): Promise<void> => {
    // Aguarda um pequeno delay para garantir que o React atualizou o DOM
    await new Promise(resolve => setTimeout(resolve, 100));
    
    const element = document.getElementById(elementId);
    console.log('Elemento para PDF:', element);
    
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
        scale: 2, // 2x de resolução para melhor qualidade
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        logging: false,
        width: 595,
        height: 830
    });

    const imgData = canvas.toDataURL('image/png');
    
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
