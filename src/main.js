const path = require('node:path');
const { app, BrowserWindow, dialog, ipcMain } = require('electron');
const { error } = require('node:console');
const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./assets/database.db');
let win;

const toMessage = {
    showError : (_mess) => new Promise (async (resolve, reject) => {
        const opts = {
            type: 'error',
            title: 'LỖI',
            message: _mess,
            buttons: ['OK'],
          };
        await dialog.showMessageBox(win, opts);
    }),
    showInfo : (_mess) => new Promise (async (resolve, reject) => {
        const opts = {
            type: 'info',
            title: 'THÔNG BÁO',
            message: _mess,
            buttons: ['OK'],
          };
        await dialog.showMessageBox(win, opts);
    })
}

const database = {
    init: () => new Promise((resolve, reject) => {
        const db = new sqlite3.Database('./assets/database.db', (err) => {
            if (err) {
                reject(err.message);
            }
            else {
                console.log("Đã mở Database thành công!");
                resolve(db);
            }
        });
    }),
    createUsers: (db) => new Promise((resolve, reject) => {

        db.run('CREATE TABLE IF NOT EXISTS users (userID INT, userName TEXT, name TEXT, userPass TEXT, isAdmin INT)', (err) => {
            if (err) {
                reject(err.message);
            }
            else {
                console.log("Đã mở thành công users");
                resolve();
            }
        });
    }),
    getlastID: (db) => new Promise(async (resolve, reject) => {
        let res = 0;

        try {
            await new Promise((innerResolve, innerReject) => {
                db.each(`SELECT userID FROM users `, (err, row) => {
                    if (err) {
                        console.log("Không duyệt được userID cuối cùng!");
                        innerReject(err);
                        return;
                    }
                    res = Math.max(Number(row["userID"].substring(3)) + 1, res);

                }, () => innerResolve());
            });

            userID = res.toString();
            while (userID.length != 4) {
                userID = '0' + userID;
            }
            userID = "UID" + userID;

            resolve(userID);
        }
        catch (err) {
            reject(err)
        }
    }),
    checkIsExist: (db, userName) => new Promise((resolve, reject) => {
        db.get(`SELECT * FROM users WHERE userName = ?`, [userName], (err, row) => {
            if (row) {
                resolve(true);
            }
            else {
                reject(false);
            }
        });
    }),
    addUser : (db, userObj) => new Promise( (resolve, reject) => {
        const {userID: userID, userName: userName, Name: name, userPass: userPass } = userObj;
    
        db.run('INSERT INTO users (userID, userName, name, userPass, isAdmin) VALUES (?, ?, ?, ?, ?)', [userID, userName, name, userPass, 0], (err) => {
            if (err) {
                reject();
                return;
            }
                                
            resolve();
            return;
        });
    }),
    checkPass : (db, [userName, userPass]) => new Promise(async (resolve, reject) => {
        try {
            const user = await new Promise ((innerResolve, innerReject) => {
                db.get('SELECT userPass FROM users WHERE userName = ?',[userName], (err, row) => {
                    if (err) {
                        innerReject(err.message);
                        return;
                    }
                    innerResolve(row);
                });
            });

            // console.log(user);

            if (user['userPass'] === userPass) {
                resolve(true);
            }
            else {
                resolve(false);
            }
        }
        catch (err) {
            reject(err)
        }
        
    })
}


const createWindow = () => {
    win = new BrowserWindow({
        width: 1920,
        height: 1080,
        webPreferences: {
            contextIsolation: true,
            preload: path.join(__dirname, "preload.js")
        }
    });
    // win.loadURL('https://github.com')

    win.loadFile('src/welcome.html');
};

app.on('ready', () => {
    ipcMain.handle('database:checkExist', async (event, ...args) => {
        try {
            console.log(...args);
            const db = await database.init();
            await database.createUsers(db);
            const response = await database.checkIsExist(db, ...args);  
            return response;
        }
        catch (err){
            console.log(err);
            return err;
        }
    })
    ipcMain.handle('database:checkPass', async (event, ...args) => {
        try {
            const db = await database.init();
            await database.createUsers(db);
            const response = await database.checkPass(db, ...args);  
            return response;
        }
        catch (err){
            console.log(err);
            return err;
        }
    })
    ipcMain.handle('database:userID', async () => {
        try {
            const db = await database.init();
            await database.createUsers(db);
            const userID = await database.getlastID(db);            
            return userID;
        }
        catch (err){
            console.log(err);
        }
    })
    ipcMain.handle('database:addUser', async (event, ...args) => {
        try {
            const db = await database.init();
            await database.createUsers(db);
            await database.addUser(db, ...args);               
        }
        catch (err){
            console.log(err);
        }
    });

    ipcMain.handle('toMessage::error', async (event, ...args) => {
        try {
            await toMessage.showError(...args);         
        }
        catch (err){
            console.log(err);
        }
    });
    
    ipcMain.handle('toMessage::info', async (event, ...args) => {
        try {
            await toMessage.showInfo(...args);         
        }
        catch (err){
            console.log(err);
        }
    });

    createWindow();

    // console.log(dialog.showMessageBox({ message : "Linh dep trai" }));

});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});


