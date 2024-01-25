const { contextBridge, ipcRenderer } = require('electron/renderer')

contextBridge.exposeInMainWorld('API', {
    toMessageError: (mess) => ipcRenderer.invoke('toMessage::error', mess),
    toMessageInfo: (mess) => ipcRenderer.invoke('toMessage::info', mess),
    toMessageConfirm: (mess) => ipcRenderer.invoke('toMessage::confirm', mess),
    getUserID: () => ipcRenderer.invoke('database:userID'),
    checkifExist: (userName) => ipcRenderer.invoke('database:checkExist', userName),
    checkPass : (userName, userPass) => ipcRenderer.invoke('database:checkPass', [userName, userPass]),
    addUser: (userObj) => ipcRenderer.invoke('database:addUser', userObj),
    gotoHome: () => ipcRenderer.send('goto:home')
});
