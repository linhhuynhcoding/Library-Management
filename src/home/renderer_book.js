let listofTitles = {};
let listofSubjects = ["Văn Học", "Kinh Tế", "Tâm Lý - Kỹ Năng Sống", "Tiểu Sử - Hồi Ký", "Nuôi Dạy Con", "Sách Thiếu Nhi", "Giáo Khoa", "Sách Học Ngoại Ngữ"];

let listofAuthors = [];
let listofPublisher = [];
let listofYears = [];
// let listofUsers = [];
// let listofUsers = [];

getDataBook = {
    init: async () => {

        const listofBooks = await window.API.book.getlistBooks();
        let listofRows = [];
        let listofTitles = {};
        let listofAuthors = [];
        let listofPublisher = [];
        let listofYears = [];

        listofBooks.sort((a, b) => {
            const x = Number(a.isbn.substring(3));
            const y = Number(b.isbn.substring(3));
            return (x - y);
        });

        for (book of listofBooks) {
            if (!listofPublisher.includes(book["publisher"])) {
                listofPublisher.push(book["publisher"]);
                let opt = document.createElement('option');
                opt.setAttribute("value", `${book["publisher"]}`);
                opt.innerText = `${book["publisher"]}`;
                document.getElementById("filter-publisher").appendChild(opt);
            }
            const yyyy = String(book["date"]).substring(String(book["date"]).length - 4);
            if (!listofYears.includes(yyyy)) {
                listofYears.push(yyyy);
            }
        }
        listofYears.sort((a, b) => { return Number(b) - Number(a) });
        for (const yyyy of listofYears) {
            let opt = document.createElement('option');
            opt.setAttribute("value", yyyy);
            opt.innerText = yyyy;
            document.getElementById("filter-year").appendChild(opt);
        }

        for (let book of listofBooks) {
            const { isbn, title, subject, author, publisher, date, pages, copies } = book;

            let row = document.createElement('tr');
            row.setAttribute("id", `${isbn}`);
            row.innerHTML += `<td >${isbn}</td>`;
            row.innerHTML += `<td colspan="3" class="has-text-weight-bold has-text-justified">${title}</td>`;
            row.innerHTML += `<td colspan="2">${subject}</td>`;
            row.innerHTML += `<td colspan="2" class="has-text-left">${author}</td>`;
            row.innerHTML += `<td colspan="2" class="has-text-justified">${publisher}</td>`;
            row.innerHTML += `<td>${date}</td>`;
            row.innerHTML += `<td>${pages} trang</td>`;
            row.innerHTML += `<td>${copies} bản</td>`;
            htmlofBtn = `<td colspan="2">`;
            htmlofBtn += `<div class="buttons is-right">`;
            htmlofBtn += `<button id="mbtn${isbn}" class="js-modal-trigger button is-small is-primary" type="button" data-target="modal-modify-book">Sửa</button>`;
            htmlofBtn += `<button id="btn${isbn}" class="js-deletebook button is-small is-danger is-light" type="button">Xóa</button>`;
            htmlofBtn += `</div>`;
            htmlofBtn += `</td>`;
            row.innerHTML += htmlofBtn;

            listofRows.push(row);
        }

        const tableUser = document.getElementById("tableBook");
        for (let row of listofRows) {
            tableUser.appendChild(row);
        }

        async function filter() {
            const queryTitle = String(document.getElementById("searchBar").value).toLowerCase();
            const querySubject = String(document.getElementById("filter-subject").value);
            const queryPublisher = String(document.getElementById("filter-publisher").value);
            const queryYear = String(document.getElementById("filter-year").value);

            for (const book of listofBooks) {

                const yyyy = String(book["date"]).substring(String(book["date"]).length - 4);

                let isVisible = (book["subject"] === querySubject) || (querySubject === "Tất cả");
                isVisible = isVisible && ((book["publisher"] === queryPublisher) || (queryPublisher === "Tất cả"));
                isVisible = isVisible && ((yyyy === queryYear) || (queryYear === "Tất cả"));
                isVisible = isVisible && (book["title"].toLowerCase().includes(queryTitle) || book["author"].toLowerCase().includes(queryTitle));

                document.getElementById(book["isbn"]).classList.toggle("hide", !isVisible);
            }

        };

        document.getElementById("searchBar").addEventListener("input", async (e) => {
            filter();
        });

        document.getElementById("filter-subject").addEventListener("change", async (e) => {
            filter();
        });

        document.getElementById("filter-publisher").addEventListener("change", async (e) => {
            filter();
        });

        document.getElementById("filter-year").addEventListener("change", async (e) => {
            filter();
        });

    },
    addBook: (bookObj) => {
        const { isbn, title, subject, author, publisher, date, pages, copies } = bookObj;


        let row = document.createElement('tr');
        row.setAttribute("id", `${isbn}`);
        row.innerHTML += `<td >${isbn}</td>`;
        row.innerHTML += `<td colspan="3" class="has-text-weight-bold has-text-justified">${title}</td>`;
        row.innerHTML += `<td colspan="2">${subject}</td>`;
        row.innerHTML += `<td colspan="2" class="has-text-left">${author}</td>`;
        row.innerHTML += `<td colspan="2" class="has-text-justified">${publisher}</td>`;
        row.innerHTML += `<td>${date}</td>`;
        row.innerHTML += `<td>${pages} trang</td>`;
        row.innerHTML += `<td>${copies} bản</td>`;
        htmlofBtn = `<td colspan="2">`;
        htmlofBtn += `<div class="buttons is-right">`;
        htmlofBtn += `<button id="mbtn${isbn}" class="js-modal-trigger button is-small is-primary" type="button" data-target="modal-modify-book">Sửa</button>`;
        htmlofBtn += `<button id="btn${isbn}" class="js-deleteuser button is-small is-danger is-light" type="button">Xóa</button>`;
        htmlofBtn += `</div>`;
        htmlofBtn += `</td>`;
        row.innerHTML += htmlofBtn;

        const tableUser = document.getElementById("tableBook");
        tableUser.appendChild(row);

        // (document.getElementById(`mbtn${uid}`)).addEventListener('click', ($trigger) => {
        //     const modal = (document.getElementById(`mbtn${uid}`)).dataset.target;
        //     const $target = document.getElementById(modal);

        //     modifyBook.openModal($target, uid);
        // });
    }
};

modifyBook = {
    // Functions to open and close a modal
    openModal: ($el, BID) => {
        subjects = {
            "Văn Học": 0,
            "Kinh Tế": 1,
            "Tâm Lý - Kỹ Năng Sống": 2,
            "Nuôi Dạy Con": 3,
            "Sách Thiếu Nhi": 4,
            "Giáo Khoa": 5,
            "Sách Học Ngoại Ngữ": 6,
            "Tiểu Sử - Hồi Ký": 7
        };

        const title = document.getElementById(`${BID}`).getElementsByTagName('td')[1].innerText;
        const subject = subjects[document.getElementById(`${BID}`).getElementsByTagName('td')[2].innerText];
        const author = document.getElementById(`${BID}`).getElementsByTagName('td')[3].innerText;
        const publisher = document.getElementById(`${BID}`).getElementsByTagName('td')[4].innerText;
        let publisher_date = document.getElementById(`${BID}`).getElementsByTagName('td')[5].innerText;

        const [pub_dd, pub_mm, pub_yyyy] = publisher_date.split("/");
        // alert(`${pub_mm}-${pub_dd}-${pub_yyyy}`);
        // alert(publisher_date.split("/"));
        let pages = String(document.getElementById(`${BID}`).getElementsByTagName('td')[6].innerText);
        let copies = String(document.getElementById(`${BID}`).getElementsByTagName('td')[7].innerText);

        pages = pages.substring(0, pages.length - 6);
        copies = copies.substring(0, copies.length - 4);


        document.getElementById("isbn").value = BID;
        document.getElementById("modify-title").value = title;
        document.getElementById("modify-author").value = author;
        document.getElementById("modify-subject").selectedIndex = subject;
        document.getElementById("modify-publisher").value = publisher;
        document.getElementById("modify-publisher-date").value = `${pub_yyyy}-${pub_mm}-${pub_dd}`;
        // alert(document.getElementById("modify-publisher-date").value);
        document.getElementById("modify-pages").value = pages;
        document.getElementById("modify-copies").value = copies;

        $el.classList.add('is-active');

    },
    closeModal: () => {
        const $target = document.getElementById("modal-modify-book");
        $target.classList.remove('is-active');
    },
    init: () => {
        (document.querySelectorAll('.js-modal-trigger') || []).forEach(($trigger) => {
            const modal = $trigger.dataset.target;
            const $target = document.getElementById(modal);

            $trigger.addEventListener('click', (event) => {
                const UID = String($trigger.id).substring(4);
                modifyBook.openModal($target, UID);
            });
        });

        (document.querySelectorAll('.modal-background, .modal-close, .modal-card-head .delete, .modal-card-foot .button') || []).forEach(($close) => {
            $close.addEventListener('click', (event) => {
                modifyBook.closeModal();
            });
        });

        (document.getElementById('modify-cancel-button').addEventListener('click', ($event) => {
            modifyBook.closeModal();
        }));

        document.getElementById('modify-submit-button').addEventListener('click', async (event) => {
            const CheckValidLogin = async () => {
                const mofify_title = document.getElementById("modify-title");
                const mofify_author = document.getElementById("modify-author");
                const mofify_subject = document.getElementById("modify-subject");
                const mofify_publisher = document.getElementById("modify-publisher");
                const mofify_publisher_date = document.getElementById("modify-publisher-date");
                const mofify_pages = document.getElementById("modify-pages");
                const mofify_copies = document.getElementById("modify-copies");

                for (let ele of [mofify_title, mofify_author, mofify_subject, mofify_publisher, mofify_publisher_date, mofify_pages, mofify_copies]) {
                    if (ele.validity.valueMissing) {
                        await window.API.toMessageInfo("Không được bỏ trống !");
                        return false;
                    }
                }
                return true;
            };

            const isValid = await CheckValidLogin();

            if (isValid === false) return;

            const BID = document.getElementById("isbn").value;

            const mofify_title = document.getElementById("modify-title").value;
            const mofify_author = document.getElementById("modify-author").value;
            const mofify_subject = document.getElementById("modify-subject").value;
            const mofify_publisher = document.getElementById("modify-publisher").value;

            const [pub_yyyy, pub_mm, pub_dd] = (document.getElementById("modify-publisher-date").value).split('-');
            const mofify_publisher_date = `${pub_dd}/${pub_mm}/${pub_yyyy}`;
            const mofify_pages = document.getElementById("modify-pages").value;
            const mofify_copies = document.getElementById("modify-copies").value;

            const title = document.getElementById(`${BID}`).getElementsByTagName('td')[1].innerText;
            const subject = subjects[document.getElementById(`${BID}`).getElementsByTagName('td')[2].innerText];
            const author = document.getElementById(`${BID}`).getElementsByTagName('td')[3].innerText;
            const publisher = document.getElementById(`${BID}`).getElementsByTagName('td')[4].innerText;
            const publisher_date = document.getElementById(`${BID}`).getElementsByTagName('td')[5].innerText;
            let pages = String(document.getElementById(`${BID}`).getElementsByTagName('td')[6].innerText);
            let copies = String(document.getElementById(`${BID}`).getElementsByTagName('td')[7].innerText);

            pages = pages.substring(0, pages.length - 6);
            copies = copies.substring(0, copies.length - 4);

            // await window.API.toMessageError(`${modify_name} ${modify_username} ${modify_password}`);

            if (mofify_title !== title ||
                mofify_author !== author ||
                mofify_subject !== subject ||
                mofify_publisher !== publisher ||
                mofify_publisher_date !== publisher_date ||
                mofify_pages !== pages ||
                mofify_copies !== copies) {

                let mess = "Bạn có chắc chắn muốn thay đổi thông tin người dùng không ?";
                const response = await window.API.toMessageConfirm(mess);
                if (response === 0) {
                    // event.preventDefault();
                    const bookObj = {
                        isbn: BID,
                        title: mofify_title,
                        subject: mofify_subject,
                        author: mofify_author,
                        publisher: mofify_publisher,
                        date: mofify_publisher_date,
                        pages: mofify_pages,
                        copies: mofify_copies
                    }

                    await window.API.book.updateBookInfo(bookObj);

                    window.location.reload();

                }
            }
            // else {
            //     modifyBook.closeModal();
            // }
        });

        (document.querySelectorAll('.js-deletebook') || []).forEach(($btn) => {
            $btn.addEventListener('click', (event) => {
                const BID = String($btn.id).substring(3);
                modifyBook.delete(BID);
            });
        });
    },
    delete: async (BID) => {
        let mess = "Bạn có chắc chắn muốn sách không ?";
        const resp = await window.API.toMessageConfirm(mess);

        if (resp === 1 || resp === undefined) return;

        if (resp === 0) {
            const response = await window.API.book.deleteBook(BID);

            if (response === true) {
                window.location.reload();
                await window.API.toMessageInfo("Đã xóa sách thành công!");
                return;
            }
            else {
                await window.API.toMessageError("Thất bại!");
                return;
            }
        }
    }
}

addBook = {
    // Functions to open and close a modal
    openModal: async ($el) => {
        const BID = await window.API.book.getBookID();

        document.getElementById("add-isbn").value = BID;
        $el.classList.add('is-active');
    },
    closeModal: () => {
        const $target = document.getElementById("modal-add-book");
        $target.classList.remove('is-active');
    },
    init: () => {
        (document.querySelectorAll('.js-add-modal-trigger') || []).forEach(($trigger) => {
            const modal = $trigger.dataset.target;
            const $target = document.getElementById(modal);
            $trigger.addEventListener('click', async (event) => {

                addBook.openModal($target);
            });
        });

        (document.querySelectorAll('.modal-background, .modal-close, .modal-card-head .delete, .modal-card-foot .button') || []).forEach(($close) => {
            $close.addEventListener('click', (event) => {
                addBook.closeModal();
            });
        });

        (document.getElementById('add-cancel-button').addEventListener('click', ($event) => {
            addBook.closeModal();
        }));

        document.getElementById('add-submit-button').addEventListener('click', async (event) => {
            const CheckValidLogin = async () => {
                const add_title = document.getElementById("add-title");
                const add_author = document.getElementById("add-author");
                const add_subject = document.getElementById("add-subject");
                const add_publisher = document.getElementById("add-publisher");
                const add_publisher_date = document.getElementById("add-publisher-date");
                const add_pages = document.getElementById("add-pages");
                const add_copies = document.getElementById("add-copies");

                for (let ele of [add_title, add_author, add_subject, add_publisher, add_publisher_date, add_pages, add_copies]) {
                    if (ele.validity.valueMissing) {
                        await window.API.toMessageInfo("Không được bỏ trống !");
                        return false;
                    }
                }
                return true;
            };

            const isValid = await CheckValidLogin();

            if (isValid === false) return;

            const BID = document.getElementById("add-isbn").value;

            const add_title = document.getElementById("add-title").value;
            const add_author = document.getElementById("add-author").value;
            const add_subject = document.getElementById("add-subject").value;
            const add_publisher = document.getElementById("add-publisher").value;

            const [pub_yyyy, pub_mm, pub_dd] = (document.getElementById("add-publisher-date").value).split('-');
            const add_publisher_date = `${pub_dd}/${pub_mm}/${pub_yyyy}`;
            const add_pages = document.getElementById("add-pages").value;
            const add_copies = document.getElementById("add-copies").value;


            let mess = "Xác nhận bạn đang thêm sách ?";
            const response = await window.API.toMessageConfirm(mess);
            if (response === 0) {
                // event.preventDefault();
                const bookObj = {
                    isbn: BID,
                    title: add_title,
                    subject: add_subject,
                    author: add_author,
                    publisher: add_publisher,
                    date: add_publisher_date,
                    pages: add_pages,
                    copies: add_copies
                }

                await window.API.book.addBook(bookObj);

                window.location.reload();
            }
            // else {
            //     modifyBook.closeModal();
            // }
        });
    }
}

document.addEventListener('DOMContentLoaded', async () => {
    await getDataBook.init();
    modifyBook.init();
    addBook.init();
});