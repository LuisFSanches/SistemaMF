// Sons de notificação gerados com Web Audio.
// Um único AudioContext é reaproveitado por todos os sons: criar um por som
// vaza contextos em telas que ficam abertas por dias (ex.: painel da loja).

let audioContext: AudioContext | null = null;

const getAudioContext = (): AudioContext | null => {
    if (audioContext) {
        return audioContext;
    }

    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) {
        return null;
    }

    audioContext = new AudioContextClass();
    return audioContext;
};

// O Chrome só libera o áudio depois de um gesto do usuário (clique/tecla).
// Chamar dentro de um handler de clique para destravar o som.
export const unlockAudio = async (): Promise<boolean> => {
    const context = getAudioContext();
    if (!context) {
        return false;
    }

    if (context.state !== 'running') {
        try {
            await context.resume();
        } catch (error) {
            console.error('Erro ao ativar o áudio:', error);
        }
    }

    return context.state === 'running';
};

export const isAudioRunning = (): boolean => audioContext?.state === 'running';

type ToneStep = [frequency: number, at: number];

const playTone = (steps: ToneStep[], gain: number, fadeAt: number, stopAt: number) => {
    const context = getAudioContext();
    if (!context) {
        return;
    }

    if (context.state !== 'running') {
        context.resume().catch(() => undefined);
    }

    const oscillator = context.createOscillator();
    const gainNode = context.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(context.destination);

    const now = context.currentTime;
    steps.forEach(([frequency, at]) => oscillator.frequency.setValueAtTime(frequency, now + at));
    gainNode.gain.setValueAtTime(gain, now);
    gainNode.gain.exponentialRampToValueAtTime(0.01, now + fadeAt);

    oscillator.onended = () => {
        oscillator.disconnect();
        gainNode.disconnect();
    };

    oscillator.start(now);
    oscillator.stop(now + stopAt);
};

// Som de notificação de novo pedido
export const playNotificationSound = () => {
    try {
        playTone([[800, 0], [1000, 0.1]], 0.8, 0.5, 0.8);
    } catch (error) {
        console.error('Erro ao reproduzir som de notificação:', error);
    }
};

// Som de pedido entregue (mais grave e melódico)
export const playDeliverySound = () => {
    try {
        playTone([[400, 0], [600, 0.15], [800, 0.3]], 1.0, 0.6, 1);
    } catch (error) {
        console.error('Erro ao reproduzir som de entrega:', error);
    }
};

// Som de pagamento confirmado para pedido online no site (mais longo)
export const playPaymentConfirmedSound = () => {
    try {
        playTone([[600, 0], [800, 0.3], [700, 0.6], [900, 0.9], [800, 1.2]], 1.0, 1.8, 2);
    } catch (error) {
        console.error('Erro ao reproduzir som de pagamento confirmado:', error);
    }
};
