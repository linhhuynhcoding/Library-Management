

regisBtn = document.getElementById("regis-btn");

const nameInput = document.getElementById('name');
const usernameInput = document.getElementById('username-regis');
const passInput = document.getElementById('password-register');
const passConfirmInput = document.getElementById('password-confirm-register');

regisBtn.addEventListener("click", async (event) => {
    event.preventDefault();

    const CheckValidRegister = () => {
        for (let ele of [nameInput, usernameInput, passInput, passConfirmInput]) {
            if (ele.validity.valueMissing) {
                ele.setCustomValidity(`Không được bỏ trống !`);
                return false;
            }
            else {
                ele.setCustomValidity(``);
            }
        }
        if (passInput.value !== passConfirmInput.value) {
            passConfirmInput.setCustomValidity(`Mật khẩu không khớp !`);
            return false;
        }
        return true;
    };

    if (CheckValidRegister()) {
        const check = await window.API.checkifExist((usernameInput.value).toLowerCase());
        if (check === true) {
            await window.API.toMessageError("TÊN ĐĂNG NHẬP ĐÃ TỒN TẠI !");
            return;
        }
        const userID = await window.API.getUserID();
        window.userObj = {
            "userID": userID,
            "userName": (usernameInput.value).toLowerCase(),
            "Name": (nameInput.value).toUpperCase(),
            "userPass": passInput.value
        }
        await window.API.addUser(userObj);

        await window.API.toMessageInfo("ĐĂNG KÝ THÀNH CÔNG! HÃY ĐĂNG NHẬP");
    }
});


document.getElementById("login-btn").addEventListener("click", async (event) => {
    event.preventDefault();

    const CheckValidLogin = () => {
        for (let ele of [login_usernameInput, login_passInput]) {
            if (ele.validity.valueMissing) {
                ele.setCustomValidity(`Không được bỏ trống !`);
                return false;
            }
            else {
                ele.setCustomValidity(``);
            }
        }
        return true;
    };

    const login_usernameInput = document.getElementById('username-login');
    const login_passInput = document.getElementById('login-password');

    if (CheckValidLogin()) {
        const checkExist = await window.API.checkifExist((login_usernameInput.value).toLowerCase());
        if (checkExist == false) {
            await window.API.toMessageError("TÊN ĐĂNG NHẬP HOẶC MẬT KHẨU KHÔNG CHÍNH XÁC !");
        }
        const checkPass = await window.API.checkPass((login_usernameInput.value).toLowerCase(), login_passInput.value);
        if (checkPass == false) {
            await window.API.toMessageError("MẬT KHẨU KHÔNG CHÍNH XÁC !");
        }
    }
});






