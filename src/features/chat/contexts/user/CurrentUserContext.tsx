import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { useSignalRContext } from '../signalr/SignalRContext';

interface CurrentUserContextType {
    currentUserId: string | null;
    setCurrentUserId: (userId: string | null) => void;
}

const CurrentUserContext = createContext<CurrentUserContextType | undefined>(undefined);

interface CurrentUserProviderProps {
    children: ReactNode;
}

export const CurrentUserProvider: React.FC<CurrentUserProviderProps> = ({ children }) => {
    const [currentUserId, setCurrentUserId] = useState<string | null>(null);
    const { startConnection, isConnected, isConnecting } = useSignalRContext();

    // Автоматично підключаємося при зміні користувача
    useEffect(() => {
        if (currentUserId && !isConnected && !isConnecting) {
            startConnection();
        }
    }, [currentUserId, isConnected, isConnecting, startConnection]);

    const value: CurrentUserContextType = {
        currentUserId,
        setCurrentUserId
    };

    return (
        <CurrentUserContext.Provider value={value}>
            {children}
        </CurrentUserContext.Provider>
    );
};

export const useCurrentUserContext = () => {
    const context = useContext(CurrentUserContext);
    if (context === undefined) {
        throw new Error('useCurrentUserContext must be used within a CurrentUserProvider');
    }
    return context;
};
