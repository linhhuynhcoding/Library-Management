// window.addEventListener('DOMContentLoaded', () => {
//     const replaceText = (selector, text) => {
//         const element = document.getElementById(selector);
//         if (element) element.innerText = text;
//     }
    
//     for (const dependency of ['chrome', 'node', 'electron']) {
//         replaceText(`${dependency}-version`, process.versions[dependency]);
//     }
// });

const container = document.getElementById('container');
const registerBtn = document.getElementById('register');
const loginBth = document.getElementById('login');

registerBtn.addEventListener('click', () => {
    container.classList.add("active");
});

loginBth.addEventListener('click', () => {
    container.classList.remove("active");
});