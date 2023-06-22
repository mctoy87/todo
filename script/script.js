'use strict';

{
  // авторизация
  const getUserName = ()=> {
    const userName = prompt('Как тебя зовут', 'Имя');
    return userName;
  };

  // получение контактов из хранилища
  const getTodoData = (userName) => (localStorage.getItem(userName) ?
  JSON.parse(localStorage.getItem(userName)) : []);

  // записать данные в ханилище
  const setTodoData = (data, userName) =>
    localStorage.setItem(userName, JSON.stringify(data));

  // удаляет из localStorage
  const removeTodoData = (task, userName) => {
    const data = getTodoData();
    const dataAfterDelete = data.filter(item => item.task !== task);
    setTodoData(dataAfterDelete, userName);
  };
  // добавляет в localStorage
  const addTodoData = (task, userName) => {
    const data = getTodoData(userName);
    data.push(task);
    setTodoData(data, userName);
  };

  const createLogo = () => {
    const h1 = document.createElement('h1');
    h1.classList.add('logo');
    h1.textContent = 'Todo App';

    return h1;
  };
  
  const createButton = (arr) => {
      const btns = arr.map(({className, type, text}) => {
      const button = document.createElement('button');
      button.type = type;
      button.textContent = text;
      button.className = className;
      return button;
    });
    return btns;
  };

  const createForm = (params) => {
    const formWrap = document.createElement('form');
    formWrap.classList.add('d-flex', 'align-items-center', 'mb-3');
    const label = document.createElement('label');
    label.classList.add('form-group', 'me-3', 'mb-0');
    const input = document.createElement('input');
    input.classList.add('form-control');
    input.placeholder = "ввести задачу";
    input.type = "text";
    input.name = "text";
    label.append(input);

    formWrap.append(label);

    const btns = createButton(params);


    formWrap.append(...btns);

    return {
      formWrap,
      btns,
      input,
    };
  };

  const createTable = () => {
    const tableWrap = document.createElement('div');
    tableWrap.classList.add('table-wrapper');

    const table = document.createElement('table');
    table.classList.add('table', 'table-hover', 'table-bordered');

    const thead = document.createElement('thead');
    thead.insertAdjacentHTML('beforeend', `
      <tr>
        <th>№</th>
        <th>Задача</th>
        <th>Статус</th>
        <th>Действия</th>
      </tr>
    `);

    const tbody = document.createElement('tbody');
    tableWrap.append(table);
    table.append(thead, tbody);
    table.tbody = tbody;

    return {
      tableWrap,
      table
    };
  };

  const renderTodo = (app) => {

    app.classList.add('vh-100', 'w-100', 'd-flex', 'align-items-center', 'justify-content-center', 'flex-column');
    const logo = createLogo();

    const form = createForm([
      {
        className: 'btn btn-primary me-3 disabled',
        type: 'submit',
        text: 'Сохранить',
      },
      {
        className: 'btn btn-warning',
        type: 'reset',
        text: 'Очистить',
      },
    ]);
    const table = createTable();

    app.append(logo, form.formWrap, table.tableWrap);

    return {
      list: table.table.tbody,
      btnAdd: form.btns[0],
      btnReset: form.btns[1],
      taskText: form.input,
      form: form.formWrap,
    };
  };

  // создает id 
  const createId = () => Math.random().toString().substring(2, 10);

  const createRow = ({text, ready, id}) => {
    const tr = document.createElement('tr');

    const tdIndex = document.createElement('td');
    tdIndex.textContent = `${id}`;

    const tdTask = document.createElement('td');
    tdTask.classList.add('task');
    tdTask.textContent = text;

    const tdStatus = document.createElement('td');
    tdStatus.classList.add('status');

    if(ready === false) {
      tr.classList.add('table-light');
      tdStatus.textContent = 'В процессе';
    } else {
      tr.classList.add('table-success');
      tdStatus.textContent = 'Выполнено';
      tdTask.classList.add('text-decoration-line-through');
    }

    const tdControl = document.createElement('td');
    const btns = createButton([
      {
        className: 'btn btn-danger',
        type: 'button',
        text: 'Удалить',
      },
      {
        className: 'btn btn-success',
        type: 'button',
        text: 'Завершить',
      },
    ]);
    tdControl.append(...btns);
    tr.append(tdIndex, tdTask, tdStatus, tdControl);

    return tr;
  };

  const renderDoings = (elem, data) => {
    const allRow = data.map(createRow);
    elem.append(...allRow);
    return allRow;
  };

  const init = (selectorApp) => {

    const app = document.querySelector(selectorApp);
    const todo = renderTodo(app);
    const {list, btnAdd, btnReset, taskText, form} = todo;
    
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