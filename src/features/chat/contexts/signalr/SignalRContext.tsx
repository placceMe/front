import React, { createContext, useContext } from 'react';
import type { ReactNode } from 'react';
import { useSignalR } from '../../hooks/useSignalR';

interface SignalRContextType {
    connection: any;
    isConnected: boolean;
    isConnecting: boolean;
    startConnection: () => Promise<void>;
    stopConnection: () => Promise<void>;
}

const SignalRContext = createContext<SignalRContextType | undefined>(undefined);

interface SignalRProviderProps {
    children: ReactNode;
    signalRUrl?: string;
}

export const SignalRProvider: React.FC<SignalRProviderProps> = ({
    children,
    signalRUrl = '/hubs/chat'
}) => {
    const signalRData = useSignalR({
        url: signalRUrl,
        automaticReconnect: true
    });

    return (
        <SignalRContext.Provider value={signalRData}>
            {children}
        </SignalRContext.Provider>
    );
};

export const useSignalRContext = () => {
    const context = useContext(SignalRContext);
    if (context === undefined) {
        throw new Error('useSignalRContext must be used within a SignalRProvider');
    }
    return context;
};
