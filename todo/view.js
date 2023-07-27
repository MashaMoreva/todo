function createAppTitle(title) {
  const appTitle = document.createElement("h2");
  appTitle.innerHTML = title;
  return appTitle;
}

function createTodoItemForm() {
  let form = document.createElement("form");
  let input = document.createElement("input");
  let buttonWrapper = document.createElement("div");
  let button = document.createElement("button");

  form.classList.add("input-group", "mb-3", "mt-3");
  input.classList.add("form-control", "mr-1");
  input.placeholder = "Введите название нового дела";
  buttonWrapper.classList.add("input-group-append");
  button.classList.add("btn", "btn-primary");
  button.textContent = "Добавить дело";
  button.disabled = !input.value.length;

  buttonWrapper.append(button);
  form.append(input);
  form.append(buttonWrapper);

  input.addEventListener("input", function () {
    button.disabled = !input.value.length;
  });

  return {
    form,
    input,
    button,
  };
}

function createTodoList() {
  const list = document.createElement("ul");
  list.classList.add("list-group");
  return list;
}

function createTodoItemElement(todoItem, { onDone, onDelete }) {
  const doneClass = "list-group-item-success";

  let item = document.createElement("li");
  let buttonGroup = document.createElement("div");
  let doneButton = document.createElement("button");
  let deleteButton = document.createElement("button");

  item.classList.add(
    "list-group-item",
    "d-flex",
    "justify-content-between",
    "align-items-center"
  );
  if (todoItem.done) {
    item.classList.add(doneClass);
  }
  item.textContent = todoItem.name;

  buttonGroup.classList.add("btn-group", "btn-group-sm");
  doneButton.classList.add("btn", "btn-success", "mr-1");
  doneButton.textContent = "Готово";
  deleteButton.classList.add("btn", "btn-danger");
  deleteButton.textContent = "Удалить";

  doneButton.addEventListener("click", () => {
    onDone({ todoItem, element: item });
    item.classList.toggle(doneClass);
  });
  deleteButton.addEventListener("click", () => {
    onDelete({ todoItem, element: item });
  });

  buttonGroup.append(doneButton, deleteButton);
  item.append(buttonGroup);

  return item;
}

async function createTodoApp(
  container,
  {
    title,
    owner,
    todoItemList = [],
    onCreateFormSubmit,
    onDoneClick,
    onDeleteClick,
  }
) {
  const todoAppTitle = createAppTitle(title);

  const todoItemForm = createTodoItemForm();
  const todoList = createTodoList();

  const handlers = {
    onDone: (todoItem) => onDoneClick(todoItem, { owner }),
    onDelete: (todoItem) => onDeleteClick(todoItem, { owner }),
  };

  container.append(todoAppTitle, todoItemForm.form, todoList);

  todoItemList.forEach((todoItem) => {
    const todoItemElement = createTodoItemElement(todoItem, handlers);
    todoList.append(todoItemElement);
  });

  todoItemForm.form.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (!todoItemForm.input.value) {
      return;
    }

    const todoItem = await onCreateFormSubmit({
      owner,
      name: todoItemForm.input.value.trim(),
    });

    const todoItemElement = createTodoItemElement(todoItem, handlers);

    todoList.append(todoItemElement);

    todoItemForm.input.value = "";
  });
}

export { createTodoApp };
