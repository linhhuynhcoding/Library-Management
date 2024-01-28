getDataUser = {
    init: async () => {
        // userID: 'UID0007',
        // userName: 'quang11',
        // name: 'QUANG TAI',
        // userPass: '123',
        // isAdmin: 0
        const listofUsers = await window.API.getlistUser();
        let listofRows = [];

        for (let user of listofUsers) {
            const { userID: uid, name: name, userName: username, userPass: password } = user;

            let row = document.createElement('tr');
            row.setAttribute("id", `${uid}`);
            row.innerHTML += `<td colspan="2" >${uid}</td>`;
            row.innerHTML += `<td colspan="5" >${name}</td>`;
            row.innerHTML += `<td colspan="3" >${username}</td>`;
            row.innerHTML += `<td colspan="3" >${password}</td>`;
            htmlofBtn = `<td colspan="3">`;
            htmlofBtn += `<div class="buttons is-right">`;
            htmlofBtn += `<button id="mbtn${uid}" class="js-modal-trigger button is-small is-primary" type="button" data-target="modal-modify-user">Sửa</button>`;
            htmlofBtn += `<button id="btn${uid}" class="js-deleteuser button is-small is-danger is-light" type="button">Xóa</button>`;
            htmlofBtn += `</div>`;
            htmlofBtn += `</td>`;
            row.innerHTML += htmlofBtn;

            listofRows.push(row);
        }

        const tableUser = document.getElementById("tableUser");
        for (let row of listofRows) {
            tableUser.appendChild(row);
        }
    },
    addUser: (userObj) => {
        const { uid, name, username, password } = userObj;
        let row = document.createElement('tr');
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

        (document.getElementById(`mbtn${uid}`)).addEventListener('click', ($trigger) => {
            const modal = (document.getElementById(`mbtn${uid}`)).dataset.target;
            const $target = document.getElementById(modal);

            modifyUser.openModal($target, uid);
        });
    }
};

modifyUser = {

    // Functions to open and close a modal
    openModal: ($el, UID) => {

        const nameofUID = document.getElementById(`${UID}`).getElementsByTagName('td')[1].innerText;
        const usernameofUID = document.getElementById(`${UID}`).getElementsByTagName('td')[2].innerText;
        const passwordofUID = document.getElementById(`${UID}`).getElementsByTagName('td')[3].innerText;

        document.getElementById("UID").value = UID;
        document.getElementById("modify-name").value = nameofUID;
        document.getElementById("modify-username").value = usernameofUID;
        document.getElementById("modify-password").value = passwordofUID;

        $el.classList.add('is-active');

    },
    closeModal: () => {
        const $target = document.getElementById("modal-modify-user");
        $target.classList.remove('is-active');
    },
    init: () => {
        (document.querySelectorAll('.js-modal-trigger') || []).forEach(($trigger) => {
            const modal = $trigger.dataset.target;
            const $target = document.getElementById(modal);

            $trigger.addEventListener('click', (event) => {
                const UID = String($trigger.id).substring(4);
                modifyUser.openModal($target, UID);
            });
        });

        (document.querySelectorAll('.modal-background, .modal-close, .modal-card-head .delete, .modal-card-foot .button') || []).forEach(($close) => {
            $close.addEventListener('click', (event) => {
                modifyUser.closeModal();
            });
        });

        (document.getElementById('modify-cancel-button').addEventListener('click', ($event) => {
            modifyUser.closeModal();
        }));

        document.getElementById('modify-submit-button').addEventListener('click', async (event) => {

            const CheckValidLogin = async () => {
                const modify_name = document.getElementById('modify-name');
                const modify_username = document.getElementById('modify-username');
                const modify_password = document.getElementById('modify-password');

                for (let ele of [modify_name, modify_username, modify_password]) {
                    if (ele.validity.valueMissing) {
                        await window.API.toMessageInfo("Không được bỏ trống !");
                        return false;
                    }
                }
                return true;
            };

            const isValid = await CheckValidLogin();

            if (isValid === false) return;

            const UID = document.getElementById("UID").value;
            const nameofUID = document.getElementById(`${UID}`).getElementsByTagName('td')[1].innerText;
            const usernameofUID = document.getElementById(`${UID}`).getElementsByTagName('td')[2].innerText;
            const passwordofUID = document.getElementById(`${UID}`).getElementsByTagName('td')[3].innerText;
            
            const modify_name = document.getElementById("modify-name").value;
            const modify_username = document.getElementById("modify-username").value;
            const modify_password = document.getElementById("modify-password").value;

            // await window.API.toMessageError(`${modify_name} ${modify_username} ${modify_password}`);

            if ( modify_name !== nameofUID ||
                modify_username !== usernameofUID ||
                modify_password!== passwordofUID) {

                let mess = "Bạn có chắc chắn muốn thay đổi thông tin người dùng không ?";
                const response = await window.API.toMessageConfirm(mess);
                if (response === 0) {
                    // event.preventDefault();
                    const check = await window.API.checkifExist(String(modify_username).toLowerCase());
                    if (check === true && modify_username !== usernameofUID ) {
                        await window.API.toMessageError("TÊN ĐĂNG NHẬP ĐÃ TỒN TẠI !");
                        return;
                    }

                    await window.API.updateUserInfo(
                        UID,
                        modify_name,
                        modify_username,
                        modify_password
                        );

                    window.location.reload();
                }

            }
            // else {
            //     modifyUser.closeModal();
            // }
        });
        
        (document.querySelectorAll('.js-deleteuser') || [] ).forEach(($btn) => {
            $btn.addEventListener('click', (event) => {
                const UID = String($btn.id).substring(3);
                modifyUser.delete(UID);
            });            
        });
    },
    delete: async (UID) => {
        let mess = "Bạn có chắc chắn muốn xóa người dùng không ?";
        const resp = await window.API.toMessageConfirm(mess);

        if (resp === 1 || resp === undefined) return;

        if (resp === 0) {
            const response = await window.API.deleteUser(UID);
            
            if (response === true) {
                window.location.reload();
                await window.API.toMessageInfo("Đã xóa người dùng thành công!");   
                return;             
            }
            else {
                await window.API.toMessageError("Thất bại!");
                return;             
            }
        }        
    }
}

// userObj = {
//     uid : null,
//     name : null,
//     username : null,
//     password : null
// }




document.addEventListener('DOMContentLoaded', async () => {
    await getDataUser.init();
    modifyUser.init();
    
    document.getElementById("btn-logout").addEventListener("click", async () => {
        const confirm = await window.API.toMessageConfirm("Bạn có chắc chắn muốn thoát không ?");
        
        if (confirm == 1 || confirm == undefined) return;

        await window.API.gotoWelcome();

    }) ;
});