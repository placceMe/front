import React, { createContext, useContext } from 'react';
import type { ReactNode } from 'react';
import { useSignalRConnection } from '../hooks/signalRConnection';

interface SignalRChatContextType {
    connection: ReturnType<typeof useSignalRConnection>['connection'];
    isConnected: boolean;
    isConnecting: boolean;
    startConnection: () => Promise<void>;
    stopConnection: () => Promise<void>;
}

const SignalRChatContext = createContext<SignalRChatContextType | null>(null);

interface SignalRChatProviderProps {
    children: ReactNode;
    hubUrl: string;
}

export const SignalRChatProvider: React.FC<SignalRChatProviderProps> = ({
    children,
    hubUrl,
}) => {
    const signalRConnection = useSignalRConnection(hubUrl);

    return (
        <SignalRChatContext.Provider value={signalRConnection}>
            {children}
        </SignalRChatContext.Provider>
    );
};

export const useSignalRChatContext = (): SignalRChatContextType => {
    const context = useContext(SignalRChatContext);

    if (!context) {
        throw new Error(
            'useSignalRChatContext must be used within a SignalRChatProvider'
        );
    }

    return context;
};

// Hook для отримання тільки connection об'єкта
export const useSignalRChatConnection = () => {
    const { connection } = useSignalRChatContext();
    return connection;
};

// Hook для отримання статусу підключення
export const useSignalRChatStatus = () => {
    const { isConnected, isConnecting } = useSignalRChatContext();
    return { isConnected, isConnecting };
};