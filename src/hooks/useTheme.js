import React, {createContext, useContext, useEffect, useState} from 'react';

const UseTheme = createContext();

export const ThemeProvider = ({ children }) => {
    const [theme, setTheme] = useState("light");

    useEffect(() => {
        document.body.setAttribute("data-bs-theme", theme);
    }, [theme]);

    return (
        <UseTheme.Provider value={{ theme, setTheme }}>
            {children}
        </UseTheme.Provider>
    );
};

export const useTheme = () => {
    const context = useContext(UseTheme);
    if (!context) {
        throw new Error('useTheme deve ser usado dentro de um ThemeProvider');
    }
    return context;
};