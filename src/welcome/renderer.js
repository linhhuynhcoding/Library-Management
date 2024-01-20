const SwapUISign = () => {
    const container = document.getElementById('container');
    const registerBtn = document.getElementById('register');
    const loginBth = document.getElementById('login');

    const registerForm = document.getElementById('form-register');
    const loginForm = document.getElementById('form-login');

    registerBtn.addEventListener('click', () => {
        container.classList.add("active");
    });

    loginBth.addEventListener('click', () => {
        container.classList.remove("active");
    });
};


window.addEventListener('DOMContentLoaded', () => {
    SwapUISign();

    document.getElementById('regis-btn').addEventListener("click", async (event) => {

        async function checkValidation() {
            const nameInput = document.getElementById('name');
            const usernameInput = document.getElementById('username-regis');
            const passInput = document.getElementById('password-register');
            const passConfirmInput = document.getElementById('password-confirm-register');


            for (let ele of [nameInput, usernameInput, passInput, passConfirmInput]) {
                if (ele.validity.valueMissing) {
                    await window.API.toMessageInfo("Không được bỏ trống !");
                    return false;
                }
            }

            if (passInput.value !== passConfirmInput.value) {
                await window.API.toMessageInfo("Mật khẩu không khớp !");
                return false;
            } else {
                return true;
            }
        }

        const isValid = await checkValidation();

        if (isValid == true) {
            // event.preventDefault();

            const nameInput = document.getElementById('name');
            const usernameInput = document.getElementById('username-regis');
            const passInput = document.getElementById('password-register');
            const passConfirmInput = document.getElementById('password-confirm-register');

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
});

document.getElementById("login-btn").addEventListener("click", async (event) => {
    // event.preventDefault();

    const CheckValidLogin = async () => {
        const login_usernameInput = document.getElementById('username-login');
        const login_passInput = document.getElementById('login-password');
        
        for (let ele of [login_usernameInput, login_passInput]) {
            if (ele.validity.valueMissing) {
                await window.API.toMessageInfo("Không được bỏ trống !");
                return false;
            }
        }
        return true;
    };

    const isValid = await CheckValidLogin();
    
    if (isValid) {
        const login_usernameInput = document.getElementById('username-login');
        const login_passInput = document.getElementById('login-password');

        const checkExist = await window.API.checkifExist((login_usernameInput.value).toLowerCase());
        if (checkExist == false) {
            await window.API.toMessageError("TÊN ĐĂNG NHẬP HOẶC MẬT KHẨU KHÔNG CHÍNH XÁC !");
        }
        const checkPass = await window.API.checkPass((login_usernameInput.value).toLowerCase(), login_passInput.value);
        if (checkPass == false) {
            await window.API.toMessageError("MẬT KHẨU KHÔNG CHÍNH XÁC !");
            return;
        }

        await window.API.gotoHome();
    }
});





