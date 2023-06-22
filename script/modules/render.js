'use strict';

import createModule from './createElements.js';

const {
  createLogo,
  createForm,
  createTable,
  createRow,
} = createModule;


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
    form: form.formWrap,
  };
};

const renderDoings = (elem, data) => {
  const allRow = data.map(createRow);
  elem.append(...allRow);
  return allRow;
};

export default {
  renderTodo,
  renderDoings,
};
