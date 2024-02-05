const { contextBridge, ipcRenderer } = require('electron');

const electronHandler = {
    ipcRenderer: {
        sendMessage(channel, ...args) {
            ipcRenderer.send(channel, ...args);
        },
        on(channel, func) {
            const subscription = (_event, ...args) =>
                func(...args);
            ipcRenderer.on(channel, subscription);

            return () => {
                ipcRenderer.removeListener(channel, subscription);
            };
        },
        once(channel, func) {
            return ipcRenderer.once(channel, (_event, ...args) => func(...args));
        },
        sendData(data) {
            return new Promise((resolve) => {
                ipcRenderer.send('sendData', data);

                const handleResponse = (event, data) => {
                    resolve(data);
                };

                ipcRenderer.once('sendDataResponse', handleResponse);

                // Limpar o ouvinte quando a resposta for recebida
                return () => {
                    ipcRenderer.removeListener('sendDataResponse', handleResponse);
                };
            });
        }
    },
};

contextBridge.exposeInMainWorld('electron', electronHandler);