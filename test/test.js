const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');

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
                reject("TỒN TẠI");
            }
            else {
                resolve("KHÔNG TỒN TẠI");
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
    getlistUser : () => new Promise(async (resolve, reject) => {
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
        }
        catch (err){
            reject(err);
        }
    })
}

async function main() {
    try {
        const db = await database.init();
        await database.createBooks(db);
        // db.get('SELECT * FROM users WHERE userName = ?',["linh12"], (err, row) => {
        //     console.log(row['userPass']);
        // });
        
        let t = [];
        const l = await new Promise((resolve, reject) => {
            db.all('SELECT title FROM books', (err, row) => {
                if (row) {
                    for (i of row) {
                        // console.log(i);
                        t.push(i["title"]);
                    }
                    resolve(t);
                }
            })
        }); 
        console.log(l);
        db.close();
    }
    catch (err) {
        console.log(err);
    }
}

main();


// loginBtn = document.getElementById("login-btn");
// const login_usernameInput = document.getElementById('username-login');
// const login_passInput = document.getElementById('login-password');

// loginBtn.addEventListener("click", async () => {
//     const CheckValidLogin = () => {         
//         for (let ele of [login_usernameInput, login_passInput]) {
//             if (ele.validity.valueMissing) {
//                 ele.setCustomValidity(`Không được bỏ trống !`);
//                 return false;
//             }
//             else {
//                 ele.setCustomValidity(``);
//             }
//         }
//         return true;
//     };


//     if (CheckValidLogin()) {
//         const checkExist = await window.API.checkifExist((login_usernameInput.value).toLowerCase());
//         if (checkExist == false) {
//             await window.API.toMessageError("TÊN ĐĂNG NHẬP HOẶC MẬT KHẨU KHÔNG CHÍNH XÁC !");
//         }
//         const checkPass = await window.API.checkPass((login_usernameInput.value).toLowerCase(), login_passInput.value);
//         if (checkPass == false) {
//             await window.API.toMessageError("MẬT KHẨU KHÔNG CHÍNH XÁC !");
//         }
//     }
// });
