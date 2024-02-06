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
        findPhp() {
            return new Promise((resolve) => {
                ipcRenderer.send('findPhp');

                const handleResponse = (event, data) => {
                    resolve(data);
                };

                ipcRenderer.once('findPhpResponse', handleResponse);

                // Limpar o ouvinte quando a resposta for recebida
                return () => {
                    ipcRenderer.removeListener('findPhpResponse', handleResponse);
                };
            });
        },
        createPhp(data) {
            return new Promise((resolve) => {
                ipcRenderer.send('createPhp', data);

                const handleResponse = (event, data) => {
                    resolve(data);
                };

                ipcRenderer.once('createPhpResponse', handleResponse);

                // Limpar o ouvinte quando a resposta for recebida
                return () => {
                    ipcRenderer.removeListener('createPhpResponse', handleResponse);
                };
            });
        },
        deletePhp(data) {
            return new Promise((resolve) => {
                ipcRenderer.send('deletePhp', data);

                const handleResponse = (event, data) => {
                    resolve(data);
                };

                ipcRenderer.once('deletePhpResponse', handleResponse);

                // Limpar o ouvinte quando a resposta for recebida
                return () => {
                    ipcRenderer.removeListener('deletePhpResponse', handleResponse);
                };
            });
        },
        findHosts() {
            return new Promise((resolve) => {
                ipcRenderer.send('findHosts');

                const handleResponse = (event, data) => {
                    resolve(data);
                };

                ipcRenderer.once('findHostsResponse', handleResponse);

                // Limpar o ouvinte quando a resposta for recebida
                return () => {
                    ipcRenderer.removeListener('findHostsResponse', handleResponse);
                };
            });
        },
        addHosts(ip, host) {
            return new Promise((resolve) => {
                ipcRenderer.send('addHosts', { ip, host });

                const handleResponse = (event, data) => {
                    resolve(data);
                };

                ipcRenderer.once('addHostsResponse', handleResponse);

                // Limpar o ouvinte quando a resposta for recebida
                return () => {
                    ipcRenderer.removeListener('addHostsResponse', handleResponse);
                };
            });
        },
        deleteHosts(host) {
            return new Promise((resolve) => {
                ipcRenderer.send('deleteHosts', { host });

                const handleResponse = (event, data) => {
                    resolve(data);
                };

                ipcRenderer.once('deleteHostsResponse', handleResponse);

                // Limpar o ouvinte quando a resposta for recebida
                return () => {
                    ipcRenderer.removeListener('deleteHostsResponse', handleResponse);
                };
            });
        },
        findSettings() {
            return new Promise((resolve) => {
                ipcRenderer.send('findSettings');

                const handleResponse = (event, data) => {
                    resolve(data);
                };

                ipcRenderer.once('findSettingsResponse', handleResponse);

                // Limpar o ouvinte quando a resposta for recebida
                return () => {
                    ipcRenderer.removeListener('findSettingsResponse', handleResponse);
                };
            });
        },
        editSettings(data) {
            return new Promise((resolve) => {
                ipcRenderer.send('editSettings', data);

                const handleResponse = (event, data) => {
                    resolve(data);
                };

                ipcRenderer.once('editSettingsResponse', handleResponse);

                // Limpar o ouvinte quando a resposta for recebida
                return () => {
                    ipcRenderer.removeListener('editSettingsResponse', handleResponse);
                };
            });
        },
        findProject() {
            return new Promise((resolve) => {
                ipcRenderer.send('findProject');

                const handleResponse = (event, data) => {
                    resolve(data);
                };

                ipcRenderer.once('findProjectResponse', handleResponse);

                // Limpar o ouvinte quando a resposta for recebida
                return () => {
                    ipcRenderer.removeListener('findProjectResponse', handleResponse);
                };
            });
        },
        createProject(data) {
            return new Promise((resolve) => {
                ipcRenderer.send('createProject', data);

                const handleResponse = (event, data) => {
                    resolve(data);
                };

                ipcRenderer.once('createProjectResponse', handleResponse);

                // Limpar o ouvinte quando a resposta for recebida
                return () => {
                    ipcRenderer.removeListener('createProjectResponse', handleResponse);
                };
            });
        },
        editProject(data) {
            return new Promise((resolve) => {
                ipcRenderer.send('editProject', data);

                const handleResponse = (event, data) => {
                    resolve(data);
                };

                ipcRenderer.once('editProjectResponse', handleResponse);

                // Limpar o ouvinte quando a resposta for recebida
                return () => {
                    ipcRenderer.removeListener('editProjectResponse', handleResponse);
                };
            });
        },
        deleteProject(data) {
            return new Promise((resolve) => {
                ipcRenderer.send('deleteProject', { data });

                const handleResponse = (event, data) => {
                    resolve(data);
                };

                ipcRenderer.once('deleteProjectResponse', handleResponse);

                // Limpar o ouvinte quando a resposta for recebida
                return () => {
                    ipcRenderer.removeListener('deleteProjectResponse', handleResponse);
                };
            });
        },
    },
    tools: {
        dialog() {
            return new Promise((resolve) => {
                ipcRenderer.send('dialog');

                const handleResponse = (event, data) => {
                    resolve(data);
                };

                ipcRenderer.once('dialogResponse', handleResponse);

                // Limpar o ouvinte quando a resposta for recebida
                return () => {
                    ipcRenderer.removeListener('dialogResponse', handleResponse);
                };
            });
        },
        dialogFolder() {
            return new Promise((resolve) => {
                ipcRenderer.send('dialogFolder');

                const handleResponse = (event, data) => {
                    resolve(data);
                };

                ipcRenderer.once('dialogFolderResponse', handleResponse);

                // Limpar o ouvinte quando a resposta for recebida
                return () => {
                    ipcRenderer.removeListener('dialogFolderResponse', handleResponse);
                };
            });
        }
    }
};

contextBridge.exposeInMainWorld('electron', electronHandler);