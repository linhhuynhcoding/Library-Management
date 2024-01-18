const NOTIFICATION_TITLE = 'Title'
const NOTIFICATION_BODY = 'Notification from the Renderer process. Click to log to console.'
const CLICK_MESSAGE = 'Notification clicked!'

window.addEventListener('DOMContentLoaded', () => {
        
    registerBtn.addEventListener('click', () => {
        container.classList.add("active");
        registerForm.reset();
    });
});