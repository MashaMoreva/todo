(function () {

    let todoArray = [];

    function createAppTitle(title) {
        let appTitle = document.createElement('h2');
        appTitle.innerHTML = title;
        return appTitle;
    }

    function createTodoForm() {
        let form = document.createElement('form');
        let input = document.createElement('input');
        let buttonWrapper = document.createElement('div');
        let button = document.createElement('button');

        form.classList.add('input-group', 'mb-3', 'mt-3');
        input.classList.add('form-control', 'mr-1');
        input.placeholder = 'Введите название нового дела';
        buttonWrapper.classList.add('input-group-append');
        button.classList.add('btn', 'btn-primary');
        button.textContent = 'Добавить дело';
        button.disabled = !input.value.length;

        buttonWrapper.append(button);
        form.append(input);
        form.append(buttonWrapper);

        input.addEventListener('input', function () {
            button.disabled = !input.value.length;
        });

        return {
            form,
            input,
            button,
        };
    }

    function createTodoList() {
        let list = document.createElement('ul');
        list.classList.add('list-group');
        return list;
    }

    function createTodoItem(name) {
        let item = document.createElement('li');

        let buttonGroup = document.createElement('div');
        let doneButton = document.createElement('button');
        let deleteButton = document.createElement('button');

        let random = (Math.random() * (11 - 1 + 1)) + 1;
        item.id = random.toFixed(2);
        item.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-center');
        item.textContent = name;

        buttonGroup.classList.add('btn-group', 'btn-group-sm');
        doneButton.classList.add('btn', 'btn-success', 'mr-1');
        doneButton.textContent = 'Готово';
        deleteButton.classList.add('btn', 'btn-danger');
        deleteButton.textContent = 'Удалить';

        buttonGroup.append(doneButton, deleteButton);
        item.append(buttonGroup);

        return {
            item,
            doneButton,
            deleteButton,
            buttonGroup,
        };
    }

    function createTodoApp(container, title, listName) {
        let todoAppTitle = createAppTitle(title);
        let todoItemForm = createTodoForm();
        let todoList = createTodoList();

        container.append(todoAppTitle, todoItemForm.form, todoList);

        if (localStorage.getItem(listName)) {
            todoArray = JSON.parse(localStorage.getItem(listName));

            for (let object of todoArray) {
                let todoItem = createTodoItem(todoItemForm.input.value);
                todoItem.item.id = object.id;
                todoItem.item.textContent = object.name;
                if (object.done == true) {
                    todoItem.item.classList.add('list-group-item-success');
                } else {
                    todoItem.item.classList.remove('list-group-item-success');
                }

                todoItem.doneButton.addEventListener('click', function () {
                    todoArray = JSON.parse(localStorage.getItem(listName));
                    todoItem.item.classList.toggle('list-group-item-success');
                    changeItemStatus(todoArray, todoItem.item);
                    localStorage.setItem(listName, JSON.stringify(todoArray));
                });

                todoItem.deleteButton.addEventListener('click', function () {
                    if (confirm('Вы уверены?')) {
                        todoArray = JSON.parse(localStorage.getItem(listName));
                        let newArray = searchDeleteItem(todoArray, todoItem.item);
                        localStorage.setItem(listName, JSON.stringify(newArray));
                        todoItem.item.remove();
                    }
                });

                todoList.append(todoItem.item);
                todoItem.item.append(todoItem.buttonGroup);

            }
        }


        function changeItemStatus(array, item) {
            array.map((obj) => {
                if (obj.id === item.id & obj.done === false) {
                    obj.done = true;
                } else if (obj.id === item.id & obj.done === true) {
                    obj.done = false;
                }
            });
        }

        function searchDeleteItem(array, item) {
            return array.filter((obj) =>
                obj.id !== item.id);
        }


        todoItemForm.form.addEventListener('submit', function (evt) {
            evt.preventDefault();

            let todoItem = createTodoItem(todoItemForm.input.value);

            if (!todoItemForm.input.value) {
                return;
            }

            todoItem.doneButton.addEventListener('click', function () {
                todoArray = JSON.parse(localStorage.getItem(listName));
                todoItem.item.classList.toggle('list-group-item-success');
                changeItemStatus(todoArray, todoItem.item);
                localStorage.setItem(listName, JSON.stringify(todoArray));
            });

            todoItem.deleteButton.addEventListener('click', function () {
                if (confirm('Вы уверены?')) {
                    todoArray = JSON.parse(localStorage.getItem(listName));
                    let newArray = searchDeleteItem(todoArray, todoItem.item);
                    localStorage.setItem(listName, JSON.stringify(newArray));
                    todoItem.item.remove();
                }
            });

            let localStorageData = localStorage.getItem(listName);
            if (localStorageData == null) {
                todoArray = [];
            } else {
                todoArray = JSON.parse(localStorageData);
            };

            function createTodoItemObject(array) {
                const itemObject = {
                    id: todoItem.item.id,
                    name: todoItemForm.input.value,
                    done: false,
                };

                array.push(itemObject);
            };

            createTodoItemObject(todoArray);
            localStorage.setItem(listName, JSON.stringify(todoArray));

            todoList.append(todoItem.item);
            todoItemForm.input.value = '';
            todoItemForm.button.disabled = true;
        });

        return;
    }

    window.createTodoApp = createTodoApp;

})();