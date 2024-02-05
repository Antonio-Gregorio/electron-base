const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');

app.whenReady().then(() => {
    const window = new BrowserWindow({
        width: 1200,
        height: 700,
        frame: false,
        webPreferences: {
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