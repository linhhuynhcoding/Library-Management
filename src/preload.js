const { contextBridge, ipcRenderer } = require('electron/renderer')

contextBridge.exposeInMainWorld('API', {
    toMessageError:     (mess) => ipcRenderer.invoke('toMessage::error', mess),
    toMessageInfo:      (mess) => ipcRenderer.invoke('toMessage::info', mess),
    toMessageConfirm:   (mess) => ipcRenderer.invoke('toMessage::confirm', mess),

    getUserID:      ()          => ipcRenderer.invoke('database:userID'),
    getlistUser:    ()          => ipcRenderer.invoke('database:getlistUser'),

    isAdmin:        (userName)  => ipcRenderer.invoke('database:isAdmin', userName),
    checkifExist:   (userName)  => ipcRenderer.invoke('database:checkExist', userName),
    addUser:        (userObj)   => ipcRenderer.invoke('database:addUser', userObj),
    deleteUser:     (userID)    => ipcRenderer.invoke('database:deleteUser', userID),
    
    checkPass :     (userName, userPass) => ipcRenderer.invoke('database:checkPass', [userName, userPass]),
    updateUserInfo: (userID, Name, userName, userPass) => ipcRenderer.invoke('database:updateUserInfo', [userID, Name, userName, userPass]),

    gotoHomeAdmin: () => ipcRenderer.send('goto:homeAdmin'),
    gotoHomeUser: () => ipcRenderer.send('goto:homeUser'),
    gotoWelcome: () => ipcRenderer.send('goto:welcome'),

    book : {
        getBookID:      ()          => ipcRenderer.invoke('databaseBook:bookID'),
        getlistBooks:   ()          => ipcRenderer.invoke('databaseBook:getlistBooks'),
        checkifExist:   (isbn)      => ipcRenderer.invoke('databaseBook:checkExist', isbn),
        deleteBook:     (isbn)      => ipcRenderer.invoke('databaseBook:deleteBook', isbn),
        getlistofLabel: (label)     => ipcRenderer.invoke('databaseBook:getlistofLabel', label),
        addBook:        (bookObj)   => ipcRenderer.invoke('databaseBook:addBook', bookObj),
        updateBookInfo: (bookObj)   => ipcRenderer.invoke('databaseBook:updateBookInfo', bookObj)
    }
});
