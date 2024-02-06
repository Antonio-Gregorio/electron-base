import React, {createContext, useContext, useEffect, useState} from 'react';

const UseTheme = createContext();

const getThemeConfig = () => {
    return window.electron.ipcRenderer.findSettings().then
}

export const ThemeProvider = ({ children }) => {
    const [theme, setTheme] = useState(localStorage.getItem("theme"));

    useEffect(() => {
        localStorage.setItem("theme", theme);
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