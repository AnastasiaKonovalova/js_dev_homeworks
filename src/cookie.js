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

let cookieName;
let cookieValue;
let row;
let nameCell;
let valueCell;
let deleteCell;
let deleteBtn;
let nameCells;

const cookies = parseCookie();
const deleteButtons = listTable.getElementsByTagName('BUTTON');
const rows = listTable.rows;

function isMatching(full, chunk) {
    return full.toLowerCase().indexOf(chunk.toLowerCase()) >= 0 ? true : false;
}

filterNameInput.addEventListener('keyup', function() {
    if (filterNameInput.value !== '') {
        for (let cell of nameCells) {
            if ( isMatching(cell.textContent, filterNameInput.value) ) {
    
            }
        }
    }
    // здесь можно обработать нажатия на клавиши внутри текстового поля для фильтрации cookie
});

function addNode(tag, text, parent, attr) {
    let elemName = document.createElement(tag);

    elemName.textContent = text;
    elemName.setAttribute('data-cellValue', attr);
    parent.appendChild(elemName);

    return elemName;
}

function addDeleteBtn(parent) {
    let btn = document.createElement('button');

    btn.textContent = 'Удалить';
    parent.appendChild(btn);
    btn.addEventListener('click', (e) => {
        let parentRow = e.target.parentNode.parentNode;
        let cookName = parentRow.cells[0].textContent;
    
        if (cookName in cookies) {
            let date = new Date(0);
    
            document.cookie = `${cookName}=${cookieValue}; ; expires=${date.toUTCString()}`;
        }
        listTable.removeChild(parentRow);
    });
}

function loadCookies() {
    for (let key in cookies) {
        row = document.createElement('tr');
        nameCell = addNode('td', key, row, 'nameCell');
        valueCell = addNode('td', cookies[key], row, 'valueCell');
        deleteCell = addNode('td', '', row, 'deleteCell');
        deleteBtn = addDeleteBtn(deleteCell);
        listTable.appendChild(row);
    }
    nameCells = document.querySelectorAll('td[data-cellValue = "nameCell"]');
}
loadCookies();

// for (let button of deleteButtons) {
//     button.addEventListener('click', (e) => {
//         let parentRow = e.target.parentNode.parentNode;
//         let cookName = parentRow.cells[0].textContent;
    
//         if (cookName in cookies) {
//             let date = new Date(0);
    
//             document.cookie = `${cookName}=${cookieValue}; ; expires=${date.toUTCString()}`;
//         }
//         listTable.removeChild(parentRow);
//     });
// }

addButton.addEventListener('click', () => {
    if (addNameInput.value === '' || addValueInput.value === '') { 
        return
    }

    cookieName = addNameInput.value;
    cookieValue = addValueInput.value;

    if (cookieName in cookies) {
        if (cookies[cookieName] === addValueInput.value) {
            return;
        } 
        document.cookie = `${cookieName}=${cookieValue}`;
        let cell = findCell(rows, cookieName, 0);

        cell.nextElementSibling.textContent = cookieValue;

    } else {
        document.cookie = `${cookieName}=${cookieValue}`;
    
        row = document.createElement('tr');
        nameCell = addNode('td', cookieName, row, 'nameCell');
        valueCell = addNode('td', cookieValue, row, 'valueCell');
        deleteCell = addNode('td', '', row, 'deleteCell');
        deleteBtn = addDeleteBtn(deleteCell);
        
        listTable.appendChild(row);
    }
    // let checkNames = checkTable(0);

    // let checkN = checkNames.some((str)=>{
    //     return str === addNameInput.value
    // });

    addNameInput.value = '';
    addValueInput.value = '';
    nameCells = document.querySelectorAll('td[data-cellValue = "nameCell"]');

    // let checkValues = checkTable(1);

    // if ( checkValues.some((str)=>{
    //     return str === addValueInput.value
    // }) ) return;

    // здесь можно обработать нажатие на кнопку "добавить cookie"
});

function findCell(tableRows, str, columnNumber) {
    for (let row of tableRows) {
        if (row.cells[columnNumber].textContent === str) {
            return row.cells[columnNumber];
        }
    }
}

function checkTable(columnNum) {
    let texts = [];

    for (let row of rows) {
        texts.push(row.cells[columnNum].textContent)
    }
    
    return texts;
}

function parseCookie() {
    let cookieArr = document.cookie.split('; ');
    let obj = {};

    cookieArr.forEach(function(item) {
        let [cooName, value] = item.split('=');

        this[cooName] = value;
    }, obj)

    return obj;
}

console.log(nameCells)