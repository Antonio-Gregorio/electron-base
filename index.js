const {app, BrowserWindow, ipcMain, dialog} = require('electron');
const path = require('path');
const {exec} = require('child_process');
const {Php, Settings, Project} = require("./models");
const {forEach} = require("react-bootstrap/ElementChildren");
const os = require("os");
const fs = require("fs");
const {Sequelize} = require("sequelize");

app.whenReady().then(() => {
    const window = new BrowserWindow({
        width: 1200,
        height: 800,
        frame: false,
        webPreferences: {
            nodeIntegration: true,
            enableRemoteModule: true,
            preload: path.join(__dirname, 'preload.js'),
        },
    });

    window.webContents.openDevTools();

    window.loadURL('http://localhost:3000/');

    ipcMain.on('close', () => {
        app.quit();
    });

    ipcMain.on('minimize', () => {
        window.minimize();
    });

});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

/*
    LISTENERS DA PÁGINA PROJETOS
 */

ipcMain.on('findProject', (event) => {
    Project.findAll({
        include: {
            model: Php,
            attributes: ['version'],
            required: true
        }
    }).then((data) => {
        let resultArray = data.map((instance) => instance.toJSON());
        return resultArray;
    }).then((data) => event.sender.send('findProjectResponse', data)).catch((e) => console.log(e));
});

ipcMain.on('createProject', (event, data) => {
    Project.create(data).then((data) => {
        event.sender.send('createProjectResponse', data);
    }).catch((e) => console.log(e));
});

ipcMain.on('editProject', (event, data) => {
    Project.update(data, {where: {id: data.id}}).then((data) => {
        event.sender.send('createProjectResponse', data);
    }).catch((e) => console.log(e));
});

ipcMain.on('deleteProject', (event, data) => {
    Project.destroy({where: {id: data}}).then((data) => {
        event.sender.send('deleteProjectResponse', data);
    }).catch((e) => console.log(e));
});

/*
    LISTENERS DA PÁGINA PHP
 */

ipcMain.on('findPhp', (event) => {
    Php.findAll().then((data) => {
        const findPromises = data.map((phpInstance) => {
            return new Promise((resolve) => {
                exec(`${phpInstance.dataValues.exe} -v`, (err) => {
                    phpInstance.dataValues.active = !err;
                    resolve(phpInstance);
                });
            });
        });

        return Promise.all(findPromises);
    }).then((data) => event.sender.send('findPhpResponse', data)).catch((e) => console.log(e));
});

ipcMain.on('createPhp', (event, data) => {
    exec(`${data.exe} -r "echo phpversion();"`, (err, stdout, stderr) => {
        if (err) {
            console.log(err)
            return;
        }

        Php.create({name: data.name, version: stdout, path: path.dirname(data.exe), exe: data.exe}).then((data) => {
            event.sender.send('createPhpResponse', data);
        }).catch((e) => console.log(e));
    });
});

ipcMain.on('deletePhp', (event, data) => {
    Php.destroy({where: {id: data}}).then((data) => {
        event.sender.send('deletePhpResponse', data);
    }).catch((e) => console.log(e));
});

/*
    LISTENERS DA PÁGINA SETTINGS
 */

ipcMain.on('findSettings', (event) => {
    Settings.findAll().then((data) => event.sender.send('findSettingsResponse', data)).catch((e) => console.log(e));
});

ipcMain.on('editSettings', (event, data) => {
    Settings.update({value: data.value}, {where: {id: data.id}}).then((data) => {
        event.sender.send('editSettingsResponse', data);
    }).catch((e) => console.log(e));
});

/*
    LISTENERS DO ARQUIVO HOSTS
 */

ipcMain.on('findHosts', (event) => {
    // Obter o diretório do sistema
    const systemDir = os.platform() === 'win32' ? process.env.SystemRoot : '/';

    // Caminho completo do arquivo hosts
    const hostsFilePath = path.join(systemDir, 'System32', 'drivers', 'etc', 'hosts');

    // Lê o conteúdo do arquivo hosts
    fs.readFile(hostsFilePath, 'utf-8', (err, data) => {
        if (err) {
            event.sender.send('findHostsResponse', {error: err.message});
        } else {
            event.sender.send('findHostsResponse', {content: parseHostsFile(data)});
        }
    });
});

ipcMain.on('addHosts', (event, {ip, host}) => {
    // Obter o diretório do sistema
    const systemDir = os.platform() === 'win32' ? process.env.SystemRoot : '/';
    // Caminho completo do arquivo hosts
    const hostsFilePath = path.join(systemDir, 'System32', 'drivers', 'etc', 'hosts');

    // Ler o conteúdo atual do arquivo hosts
    fs.readFile(hostsFilePath, 'utf-8', (readErr, data) => {
        if (readErr) {
            event.sender.send('addHostsResponse', {success: false});
            return;
        }

        // Adicionar o novo host e IP ao conteúdo do arquivo hosts
        const newContent = `${data}\n${ip}\t${host}`;

        // Escrever o novo conteúdo de volta ao arquivo hosts
        fs.writeFile(hostsFilePath, newContent, 'utf-8', (writeErr) => {
            if (writeErr) {
                event.sender.send('addHostsResponse', {success: false});
            } else {
                event.sender.send('addHostsResponse', {success: true});
            }
        });
    });
});

ipcMain.on('deleteHosts', (event, {host}) => {
    // Obter o diretório do sistema
    const systemDir = os.platform() === 'win32' ? process.env.SystemRoot : '/';
    // Caminho completo do arquivo hosts
    const hostsFilePath = path.join(systemDir, 'System32', 'drivers', 'etc', 'hosts');

    // Ler o conteúdo atual do arquivo hosts
    fs.readFile(hostsFilePath, 'utf-8', (readErr, data) => {
        if (readErr) {
            event.sender.send('deleteHostsResponse', {success: false, error: readErr.message});
            return;
        }

        // Dividir o conteúdo em linhas
        const lines = data.split('\n');

        // Filtrar as linhas, mantendo apenas aquelas que não contêm o host
        const filteredLines = lines.filter((line) => !line.includes(host));

        // Juntar as linhas filtradas de volta em uma string
        const newContent = filteredLines.join('\n');

        // Escrever o novo conteúdo de volta ao arquivo hosts
        fs.writeFile(hostsFilePath, newContent, 'utf-8', (writeErr) => {
            if (writeErr) {
                event.sender.send('deleteHostsResponse', {success: false});
            } else {
                event.sender.send('deleteHostsResponse', {success: true});
            }
        });
    });
});

/*
    TOOLS
 */

ipcMain.on('dialog', (event) => {
    const result = dialog.showOpenDialog({
        properties: ['openFile'],
        filters: [
            {name: 'Arquivo', extensions: ['exe', 'phar']},
        ],
    }).then((result) => {
        event.sender.send('dialogResponse', result);
    }).catch((e) => console.log(e));
})

ipcMain.on('dialogFolder', (event) => {
    const result = dialog.showOpenDialog({
        properties: ['openDirectory'],
    }).then((result) => {
        event.sender.send('dialogFolderResponse', result);
    }).catch((e) => console.log(e));
})

function parseHostsFile(hostsContent) {
    const hostsObject = {};

    const lines = hostsContent.split('\n');
    lines.forEach((line) => {
        // Ignorar linhas que começam com #
        if (!line.trim().startsWith('#')) {
            const parts = line.trim().split(/\s+/);
            if (parts.length >= 2) {
                const ip = parts[0];
                const hosts = parts.slice(1);
                hosts.forEach((host) => {
                    hostsObject[host] = ip;
                });
            }
        }
    });

    return hostsObject;
}