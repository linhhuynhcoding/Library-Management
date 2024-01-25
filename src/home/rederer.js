getDataUser = {
    addUser: (userObj) => {
        const { uid, name, username, password } = userObj;
        row = document.createElement('tr');
        row.setAttribute("id", `${uid}`);
        row.innerHTML += `<td>${uid}</td>`;
        row.innerHTML += `<td>${name}</td>`;
        row.innerHTML += `<td>${username}</td>`;
        row.innerHTML += `<td>${password}</td>`;
        htmlofBtn = `<td>`;
        htmlofBtn += `<div class="buttons is-right">`;
        htmlofBtn += `<button id="mbtn${uid}" class="js-modal-trigger button is-small is-primary" type="button" data-target="modal-modify-user">Sửa</button>`;
        htmlofBtn += `<button id="btn${uid}" class="button is-small is-danger is-light" type="button">Xóa</button>`;
        htmlofBtn += `</div>`;
        htmlofBtn += `</td>`;
        row.innerHTML += htmlofBtn;

        // <td>
        //     <div class="buttons is-right">
        //         <button id="btnUID0001" class="js-modal-trigger button is-small is-primary" type="button"
        //             data-target="modal-modify-user">
        //             Sửa
        //         </button>
        //         <button id="btnUID0001" class="button is-small is-danger is-light" type="button">
        //             Xóa
        //         </button>
        //     </div>
        // </td>

        const tableUser = document.getElementById("tableUser");
        tableUser.appendChild(row);
    }
};

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

        userObj = {
            uid: "test",
            name: "name",
            username: "username",
            password: "pass"
        }

        getDataUser.addUser(userObj);
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
            const UID = String($trigger.id).substring(4);
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

    (document.getElementById('modify-submit-button').addEventListener('click', async () => {
        const UID = document.getElementById("UID").value;
        const nameofUID = document.getElementById(`${UID}`).getElementsByTagName('td')[1].innerText;
        const usernameofUID = document.getElementById(`${UID}`).getElementsByTagName('td')[2].innerText;
        const passwordofUID = document.getElementById(`${UID}`).getElementsByTagName('td')[3].innerText;

        if (document.getElementById("modify-name").value !== nameofUID ||
            document.getElementById("modify-username").value !== usernameofUID ||
            document.getElementById("modify-password").value !== passwordofUID) {

            let mess = "Bạn có chắc chắn muốn thay đổi thông tin người dùng không ?";
            await window.API.toMessageConfirm(mess);
        }
        else {
            closeModal();
        }
    }));
}

// userObj = {
//     uid : null,
//     name : null,
//     username : null,
//     password : null
// }




document.addEventListener('DOMContentLoaded', () => {
    modifyUser();
});