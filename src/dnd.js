/* Задание со звездочкой */

/*
 Создайте страницу с кнопкой.
 При нажатии на кнопку должен создаваться div со случайными размерами, цветом и позицией на экране
 Необходимо предоставить возможность перетаскивать созданные div при помощи drag and drop
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

/*
 Функция должна создавать и возвращать новый div с классом draggable-div и случайными размерами/цветом/позицией
 Функция должна только создавать элемент и задвать ему случайные размер/позицию/цвет
 Функция НЕ должна добавлять элемент на страницу. На страницу элемент добавляется отдельно

 Пример:
   const newDiv = createDiv();
   homeworkContainer.appendChild(newDiv);
 */
function createDiv() {
    const newDiv = document.createElement('div');

    function randomInteger(min, max) {
        return Math.floor( min + Math.random() * ( max + 1 - min ) )
    }

    newDiv.className = 'draggable-div';
    newDiv.style.backgroundColor = `rgb(${randomInteger(0, 255)}, ${randomInteger(0, 255)}, ${randomInteger(0, 255)})`;
    newDiv.style.width = `${ randomInteger(50, 300) }px`;
    newDiv.style.height = `${ randomInteger(50, 300) }px`;
    newDiv.style.position = 'absolute';
    newDiv.style.top = `${ Math.round(Math.random() * 800) }px`;
    newDiv.style.left = `${ Math.round(Math.random() * 800) }px`;

    return newDiv;
}

/*
 Функция должна добавлять обработчики событий для перетаскивания элемента при помощи drag and drop

 Пример:
   const newDiv = createDiv();
   homeworkContainer.appendChild(newDiv);
   addListeners(newDiv);
 */
function addListeners(target) {
    target.addEventListener('mousedown', function(startEvent) {

        let getCoords = (elem) => {
            let box = elem.getBoundingClientRect();
        
            return {
                top: box.top + window.pageYOffset,
                left: box.left + window.pageXOffset
            };
        };
        let moveTo = (e) => {
            target.style.left = `${e.pageX - shiftX}px`;
            target.style.top = `${e.pageY - shiftY}px`;
            // target.style.left = `${e.pageX - target.offsetWidth / 2}px`;
            // target.style.top = `${e.pageY - target.offsetHeight / 2}px`;
        };

        let coords = getCoords(target);
        let shiftX = startEvent.pageX - coords.left;
        let shiftY = startEvent.pageY - coords.top;

        target.style.zIndex = 1000;

        moveTo(startEvent);
        document.addEventListener('mousemove', moveTo);

        target.addEventListener('mouseup', function stop() {
            document.removeEventListener ('mousemove', moveTo);
            target.removeEventListener ('mouseup', stop);
        });
    });

    target.addEventListener('dragstart', function() {
        return false;
    });
}

let addDivButton = homeworkContainer.querySelector('#addDiv');

addDivButton.addEventListener('click', function() {
    // создать новый div
    const div = createDiv();

    // добавить на страницу
    homeworkContainer.appendChild(div);
    // назначить обработчики событий мыши для реализации D&D
    addListeners(div);
    // можно не назначать обработчики событий каждому div в отдельности, а использовать делегирование
    // или использовать HTML5 D&D - https://www.html5rocks.com/ru/tutorials/dnd/basics/
});

export {
    createDiv
};
