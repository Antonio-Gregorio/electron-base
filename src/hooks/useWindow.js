import React, { createContext, useContext, useState } from 'react';

const UseWindow = createContext();

export const WindowProvider = ({ children }) => {
    const [windowLog, setWindowLog] = useState("Programa iniciado com sucesso.");

    return (
        <UseWindow.Provider value={{ windowLog, setWindowLog }}>
            {children}
        </UseWindow.Provider>
    );
};

export const useWindow = () => {
    const context = useContext(UseWindow);
    if (!context) {
        throw new Error('useWindow deve ser usado dentro de um WindowProvider');
    }
    return context;
};