/*
 Страница должна предварительно загрузить список городов из
 https://raw.githubusercontent.com/smelukov/citiesTest/master/cities.json
 и отсортировать в алфавитном порядке.

 При вводе в текстовое поле, под ним должен появляться список тех городов,
 в названии которых, хотя бы частично, есть введенное значение.
 Регистр символов учитываться не должен, то есть "Moscow" и "moscow" - одинаковые названия.

 Во время загрузки городов, на странице должна быть надпись "Загрузка..."
 После окончания загрузки городов, надпись исчезает и появляется текстовое поле.

 Разметку смотрите в файле towns-content.hbs

 Запрещено использовать сторонние библиотеки. Разрешено пользоваться только тем, что встроено в браузер

 *** Часть со звездочкой ***
 Если загрузка городов не удалась (например, отключился интернет или сервер вернул ошибку),
 то необходимо показать надпись "Не удалось загрузить города" и кнопку "Повторить".
 При клике на кнопку, процесс загруки повторяется заново
 */

/*
 homeworkContainer - это контейнер для всех ваших домашних заданий
 Если вы создаете новые html-элементы и добавляете их на страницу, то дабавляйте их только в этот контейнер

 Пример:
   const newDiv = document.createElement('div');
   homeworkContainer.appendChild(newDiv);
 */
const homeworkContainer = document.querySelector('#homework-container');

/* Блок с надписью "Загрузка" */
const loadingBlock = homeworkContainer.querySelector('#loading-block');
/* Блок с текстовым полем и результатом поиска */
const filterBlock = homeworkContainer.querySelector('#filter-block');
/* Текстовое поле для поиска по городам */
const filterInput = homeworkContainer.querySelector('#filter-input');
/* Блок с результатами поиска */
const filterResult = homeworkContainer.querySelector('#filter-result');

/*
 Функция должна вернуть Promise, который должен быть разрешен с массивом городов в качестве значения

 Массив городов пожно получить отправив асинхронный запрос по адресу
 https://raw.githubusercontent.com/smelukov/citiesTest/master/cities.json
 */

function loadTowns() {
    return new Promise((resolve, reject) => {
        let xhr = new XMLHttpRequest();

        xhr.open('GET', 'https://raw.githubusercontent.com/smelukov/citiesTest/master/cities.json', true);

        xhr.addEventListener('loadstart', function() {
            homeworkContainer.appendChild(loadingBlock);
        });
        xhr.addEventListener('load', function() {
            let resultArr = JSON.parse(this.response);

            resultArr.sort((a, b) => {
                if (a.name > b.name) { 
                    return 1; 
                }
                if (a.name < b.name) { 
                    return -1;
                }
            });

            loadingBlock.style.display = 'none';
            filterBlock.style.display = 'block';
        
            resolve(resultArr);
        });
        xhr.send();
        xhr.addEventListener('error', function() {
            reject( new Error('Не удалось загрузить города') )
        });

        if (xhr.status !== 200) {
            console.log(xhr.status); //тут всегда выводит 0 и выбрасывает ошибку
            // reject( new Error('Не удалось загрузить города') )
        }
    });
}

let cities;
let onResolved = (resolvedValue) => cities = resolvedValue;
let onRejected = (error) =>{
    loadingBlock.style.display = 'none';

    let errorDiv = document.createElement('div');
    let repeatBtn = document.createElement('button');

    errorDiv.textContent = error.message;
    repeatBtn.textContent = 'Повторить';

    homeworkContainer.appendChild(errorDiv);
    homeworkContainer.appendChild(repeatBtn);

    repeatBtn.addEventListener('click', loadTowns)
}

loadTowns().then(onResolved, onRejected);

/*
 Функция должна проверять встречается ли подстрока chunk в строке full
 Проверка должна происходить без учета регистра символов

 Пример:
   isMatching('Moscow', 'moscow') // true
   isMatching('Moscow', 'mosc') // true
   isMatching('Moscow', 'cow') // true
   isMatching('Moscow', 'SCO') // true
   isMatching('Moscow', 'Moscov') // false
 */
function isMatching(full, chunk) {
    return full.toLowerCase().indexOf(chunk.toLowerCase()) >= 0 ? true : false;
}

const list = document.createElement('ul');

filterResult.appendChild(list);

filterInput.addEventListener('keyup', function() {

    while (list.children.length > 0) {
        for (let child of list.children) {
            list.removeChild(child)
        }
    }

    filterResult.style.display = 'block';

    if (filterInput.value !== '') {
    
        for (let city of cities) {

            if ( isMatching(city.name, filterInput.value) ) {
                let item = document.createElement('li');

                item.textContent = city.name;
                list.appendChild(item);
            }
        }
    }
});

export {
    loadTowns,
    isMatching
};
