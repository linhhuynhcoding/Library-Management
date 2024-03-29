const path = require('node:path');
const { app, BrowserWindow, dialog, ipcMain } = require('electron');
const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./assets/database.db');
let window_welcome;

const toMessage = {
    showError: (_mess) => new Promise(async (resolve, reject) => {
        const opts = {
            type: 'error',
            title: 'LỖI',
            message: _mess,
            buttons: ['OK'],
        };
        await dialog.showMessageBox(opts);
    }),
    showInfo: (_mess) => new Promise(async (resolve, reject) => {
        const opts = {
            type: 'info',
            title: 'THÔNG BÁO',
            message: _mess,
            buttons: ['OK'],
        };
        await dialog.showMessageBox(opts);
    }),
    confirm: (_mess) => new Promise(async (resolve, reject) => {
        const opts = {
            type: 'question',
            title: 'XÁC NHẬN',
            message: _mess,
            buttons: ["Xác nhận", "Hủy bỏ"],
            cancelId: 1
        };
        const response = dialog.showMessageBoxSync(null, opts);

        if (response === 1)
            reject(1);
        else
            resolve(response);
    })
}

const databaseBook = {
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
    createBooks: (db) => new Promise((resolve, reject) => {

        db.run('CREATE TABLE IF NOT EXISTS books (isbn TEXT, title TEXT, subject TEXT, author TEXT, publisher TEXT, date TEXT, pages INT, copies INT)', (err) => {
            if (err) {
                reject(err.message);
            }
            else {
                console.log("Đã mở thành công books");
                resolve();
            }
        });
    }),
    getlastID: (db) => new Promise(async (resolve, reject) => {
        let res = 0;

        try {
            await new Promise((innerResolve, innerReject) => {
                db.each(`SELECT isbn FROM books `, (err, row) => {
                    if (err) {
                        console.log("Không duyệt được bookID cuối cùng!");
                        innerReject(err.message);
                        return;
                    }
                    res = Math.max(Number(row["isbn"].substring(row["isbn"].length - 3)) + 1, res);

                }, () => innerResolve(res));
            });

            let bookID = res.toString();
            while (bookID.length != 3) {
                bookID = '0' + bookID;
            }
            bookID = "BID" + bookID;

            resolve(bookID);
        }
        catch (err) {
            reject(err)
        }
    }),
    checkIsExist: (db, isbn) => new Promise((resolve, reject) => {
        db.get(`SELECT * FROM books WHERE isbn = ?`, [isbn], (err, row) => {
            if (row) {
                resolve(true);
            }
            else {
                reject(false);
            }
        });
    }),
    addBook: (db, bookObj) => new Promise((resolve, reject) => {
        // bookObj = {
        //     isbn: null,
        //     title: null,
        //     subject: null,
        //     author: null,
        //     publisher: null,
        //     date: null,
        //     pages: null,
        //     copies: null
        // }
        const { isbn, title, subject, author, publisher, date, pages, copies } = bookObj;

        db.run('INSERT INTO books (isbn , title , subject , author , publisher , date , pages , copies ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)', [isbn, title, subject, author, publisher, date, pages, copies], (err) => {

            if (err) {
                reject();
                return;
            }

            resolve();
            return;
        });
    }),
    getlistBooks: (db) => new Promise(async (resolve, reject) => {
        try {
            const books = await new Promise((innerResolve, innerReject) => {
                db.all('SELECT * FROM books', (err, row) => {
                    if (err) {
                        innerReject(err.message);
                        return;
                    }
                    innerResolve(row);
                });
            });

            resolve(books);
        }
        catch (err) {
            reject(err);
        }
    }),
    updateBookInfo: (db, bookObj) => new Promise(async (resolve, reject) => {        
        const { isbn, title, subject, author, publisher, date, pages, copies } = bookObj;
        
        db.run('UPDATE books SET title = ?, subject = ?, author = ?, publisher = ?, date = ?, pages = ?, copies = ? WHERE isbn = ?', [title, subject, author, publisher, date, pages, copies, isbn], (err) => {
            if (err) {
                reject(false);
                return;
            }
            resolve(true);
        })
    }),
    deleteBook: (db, isbn) => new Promise(async (resolve, reject) => {
        db.run('DELETE FROM books WHERE isbn = ?', [isbn], (err) => {
            if (err) {
                console.log(err.message);
                reject(false);
                return;
            }
            console.log("DELETE OK");
            resolve(true);
        })
    }),
    getlistofLabel : (db, target) => new Promise(async (resolve, reject) => {
        let t = [];
        const l = await new Promise((innerResolve, innerReject) => {
            db.all('SELECT ? FROM books', [target], (err, row) => {
                if (row) {
                    for (i of row) {
                        // console.log(i);
                        t.push(i["title"]);
                    }
                    innerResolve(t);
                }
                else{
                    innerReject();
                }
            })
        }); 
        if (l.length > 0)
            resolve(l);
        else{
            reject([]);
        }
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

        db.run('CREATE TABLE IF NOT EXISTS users (userID TEXT, userName TEXT, name TEXT, userPass TEXT, isAdmin INT)', (err) => {
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
    addUser: (db, userObj) => new Promise((resolve, reject) => {
        const { userID: userID, userName: userName, Name: name, userPass: userPass } = userObj;

        db.run('INSERT INTO users (userID, userName, name, userPass, isAdmin) VALUES (?, ?, ?, ?, ?)', [userID, userName, name, userPass, 0], (err) => {
            if (err) {
                reject();
                return;
            }

            resolve();
            return;
        });
    }),
    checkPass: (db, [userName, userPass]) => new Promise(async (resolve, reject) => {
        try {
            const user = await new Promise((innerResolve, innerReject) => {
                db.get('SELECT userPass FROM users WHERE userName = ?', [userName], (err, row) => {
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
            reject(err);
        }

    }),
    getlistUser: (db) => new Promise(async (resolve, reject) => {
        try {
            const users = await new Promise((innerResolve, innerReject) => {
                db.all('SELECT * FROM users WHERE isAdmin = 0', (err, row) => {
                    if (err) {
                        innerReject(err.message);
                        return;
                    }
                    innerResolve(row);
                });
            });

            resolve(users);
        }
        catch (err) {
            reject(err);
        }
    }),
    updateUserInfo: (db, [userID, Name, userName, userPass]) => new Promise(async (resolve, reject) => {
        db.run('UPDATE users SET userName = ?, name = ?, userPass = ? WHERE userID = ?', [userName, Name, userPass, userID], (err) => {
            if (err) {
                reject(err.message);
                return;
            }
            resolve();
        })
    }),
    deleteUser: (db, userID) => new Promise(async (resolve, reject) => {
        db.run('DELETE FROM users WHERE userID = ?', [userID], (err) => {
            if (err) {
                console.log(err.message);
                reject(false);
                return;
            }
            console.log("OK");
            resolve(true);
        })
    }),
    isAdmin: (db, userName) => new Promise((resolve, reject) => {
        db.get(`SELECT * FROM users WHERE userName = ? AND isAdmin = 1`, [userName], (err, row) => {
            if (row) {
                resolve(true);
            }
            else {
                reject(false);
            }
        });
    })
}

const createWindow = () => {
    window_welcome = new BrowserWindow({
        width: 1600,
        height: 800,
        resizable: false,
        webPreferences: {
            contextIsolation: true,
            preload: path.join(__dirname, "preload.js")
        }
    });
    // win.loadURL('https://github.com')

    window_welcome.loadFile('src/welcome/welcome.html');
};

app.on('ready', () => {

    createWindow();

    // console.log(dialog.showMessageBox({ message : "Linh dep trai" }));

});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});

ipcMain.handle('database:checkExist', async (event, ...args) => {
    try {
        console.log(...args);
        const db = await database.init();
        await database.createUsers(db);
        const response = await database.checkIsExist(db, ...args);
        // console.log(response);
        return response;
    }
    catch (err) {
        return err;
    }
})

ipcMain.handle('database:isAdmin', async (event, ...args) => {
    try {
        console.log(...args);
        const db = await database.init();
        await database.createUsers(db);
        const response = await database.isAdmin(db, ...args);
        // console.log(response);
        return response;
    }
    catch (err) {
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
    catch (err) {
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
    catch (err) {
        console.log(err);
    }
})
ipcMain.handle('database:addUser', async (event, ...args) => {
    try {
        const db = await database.init();
        await database.createUsers(db);
        await database.addUser(db, ...args);
    }
    catch (err) {
        console.log(err);
    }
});
ipcMain.handle('database:getlistUser', async () => {
    try {
        const db = await database.init();
        await database.createUsers(db);
        const listofUsers = await database.getlistUser(db);
        return listofUsers;
    }
    catch (err) {
        console.log(err);
    }
});
ipcMain.handle('database:updateUserInfo', async (event, ...args) => {
    try {
        const db = await database.init();
        await database.createUsers(db);
        await database.updateUserInfo(db, ...args);
    }
    catch (err) {
        console.log(err);
    }
});
ipcMain.handle('database:deleteUser', async (event, ...args) => {
    try {
        const db = await database.init();
        await database.createUsers(db);
        const res = await database.deleteUser(db, ...args);
        return (res);
    }
    catch (err) {
        return (err);
    }
});

ipcMain.handle('databaseBook:checkExist', async (event, ...args) => {
    try {
        console.log(...args);
        const db = await databaseBook.init();
        await databaseBook.createBooks(db);
        const response = await databaseBook.checkIsExist(db, ...args);
        // console.log(response);
        return response;
    }
    catch (err) {
        return err;
    }
})

ipcMain.handle('databaseBook:bookID', async () => {
    try {
        const db = await databaseBook.init();
        await databaseBook.createBooks(db);
        const bookID = await databaseBook.getlastID(db);
        return bookID;
    }
    catch (err) {
        console.log(err);
    }
})

ipcMain.handle('databaseBook:addBook', async (event, ...args) => {
    try {
        const db = await databaseBook.init();
        await databaseBook.createBooks(db);
        await databaseBook.addBook(db, ...args);
    }
    catch (err) {
        console.log(err);
    }
});

ipcMain.handle('databaseBook:getlistBooks', async () => {
    try {
        const db = await databaseBook.init();
        await databaseBook.createBooks(db);
        const listofBooks = await databaseBook.getlistBooks(db);
        return listofBooks;
    }
    catch (err) {
        console.log(err);
    }
});
ipcMain.handle('databaseBook:updateBookInfo', async (event, ...args) => {
    try {
        const db = await databaseBook.init();
        await databaseBook.createBooks(db);
        const res = await databaseBook.updateBookInfo(db, ...args);
        return res;
    }
    catch (err) {
        return err;
    }
});
ipcMain.handle('databaseBook:getlistofLabel', async (event, ...args) => {
    try {
        const db = await databaseBook.init();
        await databaseBook.createBooks(db);
        const res = await databaseBook.getlistofLabel(db, ...args);
        return res;
    }
    catch (err) {
        return err;
    }
});

ipcMain.handle('databaseBook:deleteBook', async (event, ...args) => {
    try {
        const db = await databaseBook.init();
        await databaseBook.createBooks(db);
        const res = await databaseBook.deleteBook(db, ...args);
        return (res);
    }
    catch (err) {
        return (err);
    }
});
ipcMain.handle('toMessage::error', async (event, ...args) => {
    try {
        await toMessage.showError(...args);
    }
    catch (err) {
        console.log(err);
    }
});

ipcMain.handle('toMessage::info', async (event, ...args) => {
    try {
        await toMessage.showInfo(...args);
    }
    catch (err) {
        console.log(err);
    }
});

ipcMain.handle('toMessage::confirm', async (event, ...args) => {
    try {
        const response = await toMessage.confirm(...args);
        return response;
    }
    catch (err) {
        return err;

    }
});

ipcMain.on('goto:homeAdmin', () => {
    window_welcome.loadFile('src/home_admin/index.html');
});

ipcMain.on('goto:homeUser', () => {
    window_welcome.loadFile('src/home_user/index.html');
});

ipcMain.on('goto:welcome', () => {
    window_welcome.loadFile('src/welcome/welcome.html');
});

