const form = document.querySelector('#form');
const inputForm = document.querySelector('#taskInput');
const taskList = document.querySelector('#tasksList');
const emptyList = document.querySelector('#emptyList');
let tasks = [];

if (localStorage.getItem('tasks')) {
    tasks = JSON.parse(localStorage.getItem('tasks'))
    tasks.forEach((task) => renderTask(task));
}

checkEmptyList()

form.addEventListener('submit', addTask);

function addTask (event) {
    event.preventDefault(); // Отмена перезеагрузки страницы
    const inputText = inputForm.value; // Достаем тексты из инпута

    const newTask = {
        id: Date.now(),
        text: inputText,
        done: false,
    };

    tasks.push(newTask)
    renderTask(newTask);

    if (taskInput.value.trim() == " ") return;

    inputForm.value = ''; // Очищаем поле после добавления
    inputForm.focus(); // Остается фокус после добавления    
    checkEmptyList();
    saveToLocalStorage();    
}

taskList.addEventListener('click', deleteTask);
taskList.addEventListener('click', doneTask);

function deleteTask(event) {
    if (event.target.dataset.action === 'delete') {
        const parentNode = event.target.closest('li');
        // Определяем ID задачи
        const id = parentNode.id;
        // Находим id в массиве
        const index = tasks.findIndex( (task) => task.id == id );
        // Удаляем обьект из массива по индексу
        tasks.splice(index, 1);
        parentNode.remove();        
    }
    checkEmptyList();
    saveToLocalStorage();
}

function doneTask(event) {
    if (event.target.dataset.action !== 'done') return;

    const parentNode = event.target.closest('.list-group-item');

    const taskTitle = parentNode.querySelector('.task-title');
    taskTitle.classList.toggle('task-title--done');
    
    // Определяем ID задачи
    const id = parentNode.id;
    // Находим id в массиве
    const task = tasks.find((task) => task.id == id);
    task.done = !task.done;
    saveToLocalStorage();
}

// local storage

// function saveHTMLToLS() {
//     localStorage.setItem('tasksHTML', taskList.innerHTML);
// }

// if (localStorage.getItem('tasksHTML')) {
//     taskList.innerHTML = localStorage.getItem('tasksHTML');
// }

function checkEmptyList() {
    if (tasks.length == 0) {
        const emptyListHTML = 
        `
        <li id="emptyList" class="list-group-item empty-list">
			<img src="./img/leaf.svg" alt="Empty" width="48" class="mt-3">
			<div class="empty-list__title">Список дел пуст</div>
		</li>
        `
        taskList.insertAdjacentHTML('beforebegin', emptyListHTML);
    }
    else {
        const emptyListEl = document.querySelector('#emptyList');
        emptyListEl ? emptyListEl.remove() : null;
    }
}

function saveToLocalStorage() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function renderTask(task) {

    // Формирование css класса
    const cssClass = task.done ? 'task-title task-title--done' : 'task-title';

    // Шаблон для задачи
    const taskHTML = `
    <li id="${task.id}" class="list-group-item d-flex justify-content-between task-item">
        <span class="${cssClass}">${task.text}</span>
        <div class="task-item__buttons">
            <button type="button" data-action="done" class="btn-action">
                <img src="./img/tick.svg" alt="Done" width="18" height="18">
            </button>
            <button type="button" data-action="delete" class="btn-action">
                <img src="./img/cross.svg" alt="Done" width="18" height="18">
            </button>
        </div>
    </li>`

    taskList.insertAdjacentHTML('beforeend', taskHTML); // Добавить задачу после предыдущей записи
}
