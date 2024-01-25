 function modifyUser() {

    // Functions to open and close a modal
    function openModal(e, $el, UID) {

        const nameofUID = document.getElementById(`${UID}`).getElementsByTagName('td')[1].innerText;
        const usernameofUID = document.getElementById(`${UID}`).getElementsByTagName('td')[2].innerText;
        const passwordofUID = document.getElementById(`${UID}`).getElementsByTagName('td')[3].innerText;

        document.getElementById("UID").value = UID;
        document.getElementById("modify-name").value = nameofUID;
        document.getElementById("modify-username").value = usernameofUID;
        document.getElementById("modify-password").value = passwordofUID;
        
        $el.classList.add('is-active');

    }

    function closeModal() {        
        const $target = document.getElementById("modal-modify-user");
        $target.classList.remove('is-active');
    }

    // Add a click event on buttons to open a specific modal
    (document.querySelectorAll('.js-modal-trigger') || []).forEach(($trigger) => {
        const modal = $trigger.dataset.target;
        const $target = document.getElementById(modal);        
        
        $trigger.addEventListener('click', (event) => {
            const UID = String($trigger.id).substring(3);
            openModal(event, $target, UID);
        });
    });

    // Add a click event on various child elements to close the parent modal
    (document.querySelectorAll('.modal-background, .modal-close, .modal-card-head .delete, .modal-card-foot .button') || []).forEach(($close) => {
        $close.addEventListener('click', (event) => {
            closeModal();
        });
    });

    (document.getElementById('modify-cancel-button').addEventListener('click', ($event) => {
        closeModal();
    }));

    (document.getElementById('modify-submit-button').addEventListener('click',async () => {
        const UID = document.getElementById("UID").value;
        const nameofUID = document.getElementById(`${UID}`).getElementsByTagName('td')[1].innerText;
        const usernameofUID = document.getElementById(`${UID}`).getElementsByTagName('td')[2].innerText;
        const passwordofUID = document.getElementById(`${UID}`).getElementsByTagName('td')[3].innerText;

        if (document.getElementById("modify-name").value !== nameofUID ||
            document.getElementById("modify-username").value !== usernameofUID ||
            document.getElementById("modify-password").value !== passwordofUID ) {

                let mess = "Bạn có chắc chắn muốn thay đổi thông tin người dùng không ?";
                await window.API.toMessageConfirm(mess);
        }
        else {
            closeModal();
        }
    }));
}


document.addEventListener('DOMContentLoaded', () => {
    modifyUser();
});