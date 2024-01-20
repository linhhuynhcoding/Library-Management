const { contextBridge, ipcRenderer } = require('electron/renderer')

contextBridge.exposeInMainWorld('API', {
    toMessageError: (mess) => ipcRenderer.invoke('toMessage::error', mess),
    toMessageInfo: (mess) => ipcRenderer.invoke('toMessage::info', mess),
    getUserID: () => ipcRenderer.invoke('database:userID'),
    checkifExist: (userName) => ipcRenderer.invoke('database:checkExist', userName),
    checkPass : (userName, userPass) => ipcRenderer.invoke('database:checkPass', [userName, userPass]),
    addUser: (userObj) => ipcRenderer.invoke('database:addUser', userObj)
});

const SwapUISign = () => {
    const container = document.getElementById('container');
    const registerBtn = document.getElementById('register');
    const loginBth = document.getElementById('login');

    const registerForm = document.getElementById('form-register');
    const loginForm = document.getElementById('form-login');

    registerBtn.addEventListener('click', () => {
        container.classList.add("active");
        registerForm.reset();
    });

    loginBth.addEventListener('click', () => {
        container.classList.remove("active");
        loginForm.reset();
    });
};

window.addEventListener('DOMContentLoaded', () => {
    SwapUISign();
});