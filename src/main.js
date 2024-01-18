const path = require('node:path');
const { app, BrowserWindow, dialog } = require('electron');
const sqlite3 = require('sqlite3').verbose();

// var userObj = {
//     "userID" : null,
//     "userName" : null,
//     "userPass" : null,
//     "isAdmin"  : null
// }

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
    // console.log(dialog.showMessageBox({ message : "Linh dep trai" }));
    
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});


const database = class {
    let db = new sqlite3.Database('./assets/database.db');
    db.run('CREATE TABLE IF NOT EXISTS users (userID INT, userName TEXT, userPass TEXT, isAdmin INT)');
    
    addUser () {
        const {userID, userName, userPass, isAdmin} = userObj;
        db.run('INSERT INTO users (userID, userName, userPass, isAdmin) VALUES (?, ?, ?, ?)', [userID, userName, userPass, isAdmin]);  
    };

    addUser(userObj);
};
