/*
 ДЗ 7 - Создать редактор cookie с возможностью фильтрации

 7.1: На странице должна быть таблица со списком имеющихся cookie. Таблица должна иметь следующие столбцы:
   - имя
   - значение
   - удалить (при нажатии на кнопку, выбранная cookie удаляется из браузера и таблицы)

 7.2: На странице должна быть форма для добавления новой cookie. Форма должна содержать следующие поля:
   - имя
   - значение
   - добавить (при нажатии на кнопку, в браузер и таблицу добавляется новая cookie с указанным именем и значением)

 Если добавляется cookie с именем уже существующией cookie, то ее значение в браузере и таблице должно быть обновлено

 7.3: На странице должно быть текстовое поле для фильтрации cookie
 В таблице должны быть только те cookie, в имени или значении которых, хотя бы частично, есть введенное значение
 Если в поле фильтра пусто, то должны выводиться все доступные cookie
 Если дабавляемая cookie не соответсвуте фильтру, то она должна быть добавлена только в браузер, но не в таблицу
 Если добавляется cookie, с именем уже существующией cookie и ее новое значение не соответствует фильтру,
 то ее значение должно быть обновлено в браузере, а из таблицы cookie должна быть удалена

 Запрещено использовать сторонние библиотеки. Разрешено пользоваться только тем, что встроено в браузер
 */

/*
 homeworkContainer - это контейнер для всех ваших домашних заданий
 Если вы создаете новые html-элементы и добавляете их на страницу, то дабавляйте их только в этот контейнер

 Пример:
   const newDiv = document.createElement('div');
   homeworkContainer.appendChild(newDiv);
 */
const homeworkContainer = document.querySelector('#homework-container');
// текстовое поле для фильтрации cookie
const filterNameInput = homeworkContainer.querySelector('#filter-name-input');
// текстовое поле с именем cookie
const addNameInput = homeworkContainer.querySelector('#add-name-input');
// текстовое поле со значением cookie
const addValueInput = homeworkContainer.querySelector('#add-value-input');
// кнопка "добавить cookie"
const addButton = homeworkContainer.querySelector('#add-button');
// таблица со списком cookie
const listTable = homeworkContainer.querySelector('#list-table tbody');

// Тут хранится и обновляется коллекция ячеек с именами кук. 
// Обновляется в loadCookies() и в обработчике кнопки "Добавить"
let nameCells;
// Тут хранится и обновляется объект с именами и значениями имеющихся в браузере кук. Записывается из parseCookie()
let cookies;
// Коллекция рядов тела таблицы. Обновляется в loadCookies() и в обработчике кнопки "Добавить"
let rows;

// Вспомогательные функции

// Поиск в строках
function isMatching(full, chunk) {
    return full.toLowerCase().indexOf(chunk.toLowerCase()) >= 0 ? true : false;
}
// Добавление ячеек
function addNode(tag, text, parent, attr) {
    let elemName = document.createElement(tag);

    elemName.textContent = text;
    elemName.setAttribute('data-cellValue', attr);
    parent.appendChild(elemName);

    return elemName;
}
// Добавление кнопок "Удалить" с уже повешенными обработчиками событий
function addDeleteBtn(parent) {
    let btn = document.createElement('button');

    btn.textContent = 'Удалить';
    parent.appendChild(btn);
    btn.addEventListener('click', (e) => {
        let parentRow = e.target.parentNode.parentNode;
        let cookName = parentRow.cells[0].textContent;
    
        if (cookName in cookies) {
            let date = new Date(0);
    
            document.cookie = `${cookName}=''; ; expires=${date.toUTCString()}`;
        }
        listTable.removeChild(parentRow);
    });
}
// Добавление в таблицу уже имеющихся в браузере кук при загрузке страницы и запись коллекции ячеек с именами загруженных кук
function loadCookies() {
    for (let key in cookies) {
        if (cookies.hasOwnProperty(key)) {
            let row = document.createElement('tr');

            addNode('td', key, row, 'nameCell');
            addNode('td', cookies[key], row, 'valueCell');

            let deleteCell = addNode('td', '', row, 'deleteCell');

            addDeleteBtn(deleteCell);
            listTable.appendChild(row);
            row.style.display = 'table-row';
        }
    }
    nameCells = document.querySelectorAll('td[data-cellValue = "nameCell"]'); // Записать коллекцию ячеек с именами
    rows = listTable.rows; // Записать коллекцию рядов таблицы
}
// Поиск ячейки с нужным текстом (str) в определенной коллекции рядов и колонке
function findCell(tableRows, str, columnNumber) {
    for (let row of tableRows) {
        if (row.cells[columnNumber].textContent === str) {
            return row.cells[columnNumber];
        }
    }
}
// Получить объект с именами и значениями кук
function parseCookie() {
    let cookieArr = document.cookie.split('; ');
    let obj = {};

    cookieArr.forEach(function(item) {
        let [cooName, value] = item.split('=');

        this[cooName] = value;
    }, obj)

    cookies = obj;
}

// Записать объект с именами и значениями имеющихся в браузере кук в переменную cookies. 
// Его потом обновляем в обработчике кнопки "Добавить"
parseCookie();
// Добавить имеющиеся куки при загрузке страницы из объекта cookies
loadCookies();

// Обработчики событий
// Фильтрация
filterNameInput.addEventListener('keyup', function() {
    let filter = filterNameInput.value;

    if (filter !== '') {
        for (let cell of nameCells) {
            if ( !isMatching(cell.textContent, filter) && !isMatching(cell.nextElementSibling.textContent, filter) ) {
                cell.parentNode.style.display = 'none';
            } else if ( isMatching(cell.textContent, filter) || 
                        isMatching(cell.nextElementSibling.textContent, filter) ) {
                cell.parentNode.style.display = 'table-row';
            }
        }
    } else {
        for (let row of rows) {
            row.style.display = 'table-row';
        }
    }
});

// Добавление кук
addButton.addEventListener('click', () => {
    if (addNameInput.value === '' || addValueInput.value === '') { 
        return
    }

    let cookieName = addNameInput.value;
    let cookieValue = addValueInput.value;
    let filter = filterNameInput.value;

    if (cookieName in cookies) {
        if (cookies[cookieName] === cookieValue) {
            return;
        } 
        document.cookie = `${cookieName}=${cookieValue}`;
        let cell = findCell(rows, cookieName, 0);

        cell.nextElementSibling.textContent = cookieValue;
        if (filter !== '') {
            if (!isMatching(cookieValue, filter) ) {
                cell.parentNode.style.display = 'none'
            }
        }

    } else {
        document.cookie = `${cookieName}=${cookieValue}`;
    
        let row = document.createElement('tr');
        
        addNode('td', cookieName, row, 'nameCell');
        addNode('td', cookieValue, row, 'valueCell');

        let deleteCell = addNode('td', '', row, 'deleteCell');

        addDeleteBtn(deleteCell);
        listTable.appendChild(row);

        if (filter !== '') {
            if (!isMatching( cookieName, filter) && !isMatching(cookieValue, filter) ) {
                row.style.display = 'none'
            }
        }
    }

    addNameInput.value = '';
    addValueInput.value = '';
    nameCells = document.querySelectorAll('td[data-cellValue = "nameCell"]'); // Обновить коллекцию ячеек с именами
    rows = listTable.rows; // Записать коллекцию рядов таблицы
    parseCookie(); // Обновить объект с куками
});