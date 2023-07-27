export function getTodoList(owner) {
  let todoList = [];

  if (localStorage.getItem(owner)) {
    todoList = JSON.parse(localStorage.getItem(owner));
  }

  return todoList;
}

function generateUniqueId() {
  let random = Math.random() * (11 - 1 + 1) + 1;
  return random.toFixed(2);
}

export function createTodoItem({ owner, name }) {
  const todoList = getTodoList(owner);
  const newTodo = { id: generateUniqueId(), name, done: false };
  todoList.push(newTodo);
  localStorage.setItem(owner, JSON.stringify(todoList));
  return newTodo;
}

export function switchTodoItemDone(todoItem, { owner }) {
  const todo = todoItem.todoItem;
  const todoList = getTodoList(owner);
  const item = todoList.find((obj) => obj.id === todo.id);
  if (item) {
    item.done = !item.done;
    localStorage.setItem(owner, JSON.stringify(todoList));
  }
}

export function deleteTodoItem(todoItem, { owner }) {
  const todo = todoItem.todoItem;
  const element = todoItem.element;
  if (confirm("Вы уверены?")) {
    const todoList = getTodoList(owner);
    const updatedList = todoList.filter((item) => item.id !== todo.id);
    localStorage.setItem(owner, JSON.stringify(updatedList));
    if (element) {
      element.remove();
    }
  }
}
