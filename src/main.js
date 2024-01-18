const path = require('node:path');
const { app, BrowserWindow, dialog } = require('electron');
// const { Notification } = require('electron');
const { dir } = require('node:console');


const createWindow = () => {
    const win = new BrowserWindow({
        width: 1920,
        height: 1080,
        webPreferences: {
            contextIsolation: true,
            preload: path.join(__dirname, "preload.js")
        }
    });
    // win.loadURL('https://github.com')
    
    win.loadFile('src/welcome.html');
}




app.on('ready', () => {
    createWindow();
    console.log(dialog.showMessageBox({ message : "Linh dep trai" }));
    
});

// app.on('window-all-closed', () => {
//     if (process.platform !== 'darwin') app.quit();
// });
