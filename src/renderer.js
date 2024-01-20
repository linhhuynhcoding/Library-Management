

window.addEventListener('DOMContentLoaded', () => {
    regisBtn = document.getElementById("regis-btn");

    const nameInput = document.getElementById('name');
    const usernameInput = document.getElementById('username-regis');
    const passInput = document.getElementById('password-register');
    const passConfirmInput = document.getElementById('password-confirm-register');

    regisBtn.addEventListener("click", async () => {
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
            if (check === false){
                await window.API.toMessageError("TÊN ĐĂNG NHẬP ĐÃ TỒN TẠI !");
                return;
            }
            const userID = await window.API.getUserID();
            window.userObj = {
                "userID": userID,
                "userName": (usernameInput.value).toLowerCase(),
                "Name":  (nameInput.value).toUpperCase(),
                "userPass" : passInput.value
            }
            await window.API.addUser(userObj);
            
            await window.API.toMessageInfo("ĐĂNG KÝ THÀNH CÔNG! HÃY ĐĂNG NHẬP");
        }    
    });
});







