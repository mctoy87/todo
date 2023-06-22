'use strict';

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

export default {
  createLogo,
  createButton,
  createForm,
  createTable,
  createId,
  createRow,
};
