
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
