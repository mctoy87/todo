'use strict';

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

  export default {
    getUserName,
    getTodoData,
    setTodoData,
    removeTodoData,
    addTodoData,
  };
