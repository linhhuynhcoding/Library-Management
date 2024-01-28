const listofSubjects = ["Văn Học", "Kinh Tế", "Tâm Lý - Kỹ Năng Sống", "Tiểu Sử - Hồi Ký", "Nuôi Dạy Con", "Sách Thiếu Nhi", "Giáo Khoa", "Sách Học Ngoại Ngữ"];

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
            row.innerHTML += `<td colspan="2">${date}</td>`;
            row.innerHTML += `<td colspan="2">${pages} trang</td>`;
            row.innerHTML += `<td colspan="2">${copies} bản</td>`;

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

    }
};

document.addEventListener('DOMContentLoaded', async () => {
    document.getElementById("btn-logout").addEventListener("click", async () => {
        const confirm = await window.API.toMessageConfirm("Bạn có chắc chắn muốn thoát không ?");
        
        if (confirm == 1 || confirm == undefined) return;

        await window.API.gotoWelcome();

    }) ;
    
    await getDataBook.init();
});