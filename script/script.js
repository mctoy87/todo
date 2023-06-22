'use strict';

import renderModule from './modules/render.js';
import createModule from './modules/createElements.js';
import storageModule from './modules/serviceStorage.js';

const {
  renderTodo,
  renderDoings,
} = renderModule;

const {
  createId,
  createRow,
} = createModule;

const {
  getUserName,
  getTodoData,
  setTodoData,
  addTodoData,
} = storageModule;

{
  const init = (selectorApp) => {

    const app = document.querySelector(selectorApp);
    const todo = renderTodo(app);
    const {list, btnAdd, form} = todo;
    
    // Функционал

    const userName = getUserName();
    const data = getTodoData(userName);
    const allRow = renderDoings(list, data);

    //события

    // создаем новую задачу в localStorage и в верстку
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const formData = new FormData(e.target);
      const dataTask = Object.fromEntries(formData);
      
      // добавляем в объект formData свойства статус и id
      dataTask.ready = false;
      dataTask.id = createId();

      // создаем в верстке задачу 
      const newTask = createRow(dataTask);
      list.insertAdjacentElement('beforeend',newTask);
      
      // создаем в localStorage задачу 
      addTodoData(dataTask, userName); 

      // сбрасываем форму и добаляем disabled на кнопку Сохранить
      form.reset();
      btnAdd.classList.add('disabled');
    });

    // добавляем/убираем на input disabled с кнопки Сохранить
    form.text.addEventListener('input', (e) => {
      e.target.value ? btnAdd.classList.remove('disabled') : btnAdd.classList.add('disabled');
    });
    // добавляем на input disabled с кнопки Очистить
    form.addEventListener('click', (e) => {
      if(e.target.classList.contains('btn-warning')) {
        btnAdd.classList.add('disabled');
      }
    });
    // события на списке задач
    list.addEventListener('click', (e) => {
      const target = e.target;
      const RowDone = target.closest('tr');
      const task = RowDone.querySelector('.task');

      // клик по кнопке удалить
      if(target.classList.contains('btn-danger')) {
        // сохраняем в localStorage
        const data = getTodoData(userName);
        const newData = data.filter((item) => item.text !== task.textContent);
        setTodoData(newData, userName);

        // удаляем из верстки
        RowDone.remove();
      }

      // клик по кнопке завершить
      if(target.classList.contains('btn-success')) {
        if(target.closest('.table-light')) {
          // const task = RowDone.querySelector('.task');
          const status = RowDone.querySelector('.status');
          
          // зачеркиваем текст задачи
          task.classList.remove();
          task.classList.add('text-decoration-line-through');

          // меняем статус
          status.textContent = 'Выполнена';

          // меняем бэкгроунд строки
          RowDone.classList.remove('table-light');
          RowDone.classList.add('table-success');

          // сохраняем в localStorage
          const data = getTodoData(userName);
          for(let i = 0; i < data.length; i++) {
            if (data[i].text === task.textContent) {
              data[i].ready = true;
            }
          }
          setTodoData(data, userName);
        }
      }
    });
  };


  window.todoInit = init;
} 