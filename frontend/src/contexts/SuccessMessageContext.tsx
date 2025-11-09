import { createContext, useContext, useState, ReactNode } from 'react';
import { SuccessMessage } from '../components/SuccessMessage';

interface ISuccessMessageContextData {
    showSuccess: (message: string) => void;
}

const SuccessMessageContext = createContext<ISuccessMessageContextData>({} as ISuccessMessageContextData);

interface ISuccessMessageProviderProps {
    children: ReactNode;
}

interface IMessage {
    id: number;
    text: string;
}

export function SuccessMessageProvider({ children }: ISuccessMessageProviderProps) {
    const [messages, setMessages] = useState<IMessage[]>([]);
    const [nextId, setNextId] = useState(0);

    const showSuccess = (message: string) => {
        const id = nextId;
        setMessages((prev) => [...prev, { id, text: message }]);
        setNextId((prev) => prev + 1);
    };

    const handleClose = (id: number) => {
        setMessages((prev) => prev.filter((msg) => msg.id !== id));
    };

    return (
        <SuccessMessageContext.Provider value={{ showSuccess }}>
            {children}
            {messages.map((msg, index) => (
                <div
                    key={msg.id}
                    style={{
                        position: 'fixed',
                        top: `${20 + index * 90}px`,
                        right: '20px',
                        zIndex: 10000,
                    }}
                >
                    <SuccessMessage
                        message={msg.text}
                        onClose={() => handleClose(msg.id)}
                    />
                </div>
            ))}
        </SuccessMessageContext.Provider>
    );
}

export function useSuccessMessage() {
    const context = useContext(SuccessMessageContext);
    
    if (!context) {
        throw new Error('useSuccessMessage must be used within SuccessMessageProvider');
    }
    
    return context;
}
