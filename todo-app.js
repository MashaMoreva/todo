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

    function createTodoItemElement(todoItem, { onDone, onDelete }) {
        let item = document.createElement('li');

        let buttonGroup = document.createElement('div');
        let doneButton = document.createElement('button');
        let deleteButton = document.createElement('button');

        let random = (Math.random() * (11 - 1 + 1)) + 1;
        item.id = random.toFixed(2);
        item.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-center');
        item.textContent = todoItem.name;

        buttonGroup.classList.add('btn-group', 'btn-group-sm');
        doneButton.classList.add('btn', 'btn-success', 'mr-1');
        doneButton.textContent = 'Готово';
        deleteButton.classList.add('btn', 'btn-danger');
        deleteButton.textContent = 'Удалить';

        if (todoItem.done) {
            item.classList.add('list-group-item-success');
        }


        function searchItemStatus(array, item) {
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

        function changeItemStatus(item, button) {
            button.addEventListener('click', function () {
                onDone({ todoItem, element: item });
                // todoArray = JSON.parse(localStorage.getItem(listName));
                item.classList.toggle('list-group-item-success', todoItem.done);
                // searchItemStatus(todoArray, item);
                // localStorage.setItem(listName, JSON.stringify(todoArray));
            });
        }

        function deleteItem(item, button) {
            button.addEventListener('click', function () {
                onDelete({ todoItem, element: item });
                // if (confirm('Вы уверены?')) {
                //     todoArray = JSON.parse(localStorage.getItem(listName));
                //     let newArray = searchDeleteItem(todoArray, item);
                //     localStorage.setItem(listName, JSON.stringify(newArray));
                //     item.remove();
                // }
            });
        }

        changeItemStatus(item, doneButton);
        deleteItem(item, deleteButton);

        buttonGroup.append(doneButton, deleteButton);
        item.append(buttonGroup);

        return item;
    }

    async function createTodoApp(container, title, owner) {
        let todoAppTitle = createAppTitle(title);
        let todoItemForm = createTodoForm();
        let todoList = createTodoList();
        const handlers = {
            onDone({ todoItem }) {
                todoItem.done = !todoItem.done;
                fetch(`http://localhost:3000/api/todos/${todoItem.id}`, {
                    method: 'PATCH',
                    body: JSON.stringify({ done: todoItem.done }),
                    headers: {
                        'Content-Type': 'application/json'
                    },
                });
            },
            onDelete({ todoItem, element }) {
                if (confirm('Вы уверены?')) {
                    element.remove();
                    fetch(`http://localhost:3000/api/todos/${todoItem.id}`, {
                        method: 'DELETE',
                    });
                    if (response.status === 404)
                        console.log('Не удалось удалить дело, так как его не существует');
                }
            }
        }

        container.append(todoAppTitle, todoItemForm.form, todoList);

        const response = await fetch(`http://localhost:3000/api/todos?owner=${owner}`);
        const todoItemList = await response.json();

        todoItemList.forEach((todoItem) => {
            const todoItemElement = createTodoItemElement(todoItem, handlers);
            todoList.append(todoItemElement);
        })

        // if (localStorage.getItem(listName)) {
        //     todoArray = JSON.parse(localStorage.getItem(listName));

        //     for (let object of todoArray) {
        //         let todoItem = createTodoItem(todoItemForm.input.value);
        //         todoItem.item.id = object.id;
        //         todoItem.item.textContent = object.name;
        //         if (object.done == true) {
        //             todoItem.item.classList.add('list-group-item-success');
        //         } else {
        //             todoItem.item.classList.remove('list-group-item-success');
        //         }


        //         changeItemStatus(todoItem.item, todoItem.doneButton);
        //         deleteItem(todoItem.item, todoItem.deleteButton);
        //         // todoItem.doneButton.addEventListener('click', function () {
        //         //     todoArray = JSON.parse(localStorage.getItem(listName));
        //         //     todoItem.item.classList.toggle('list-group-item-success');
        //         //     changeItemStatus(todoArray, todoItem.item);
        //         //     localStorage.setItem(listName, JSON.stringify(todoArray));
        //         // });

        //         // todoItem.deleteButton.addEventListener('click', function () {
        //         //     if (confirm('Вы уверены?')) {
        //         //         todoArray = JSON.parse(localStorage.getItem(listName));
        //         //         let newArray = searchDeleteItem(todoArray, todoItem.item);
        //         //         localStorage.setItem(listName, JSON.stringify(newArray));
        //         //         todoItem.item.remove();
        //         //     }
        //         // });

        //         todoList.append(todoItem.item);
        //         todoItem.item.append(todoItem.buttonGroup);

        //     }
        // }

        todoItemForm.form.addEventListener('submit', async function (evt) {
            evt.preventDefault();

            if (!todoItemForm.input.value) {
                return;
            }

            const response = await fetch('http://localhost:3000/api/todos', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name: todoItemForm.input.value.trim(),
                    owner
                })
            });
            const todoItem = await response.json();
            const todoItemElement = createTodoItemElement(todoItem, handlers);

            // todoItem.doneButton.addEventListener('click', function () {
            //     todoArray = JSON.parse(localStorage.getItem(listName));
            //     todoItem.item.classList.toggle('list-group-item-success');
            //     changeItemStatus(todoArray, todoItem.item);
            //     localStorage.setItem(listName, JSON.stringify(todoArray));
            // });

            // todoItem.deleteButton.addEventListener('click', function () {
            //     if (confirm('Вы уверены?')) {
            //         todoArray = JSON.parse(localStorage.getItem(listName));
            //         let newArray = searchDeleteItem(todoArray, todoItem.item);
            //         localStorage.setItem(listName, JSON.stringify(newArray));
            //         todoItem.item.remove();
            //     }
            // });

            // let localStorageData = localStorage.getItem(listName);
            // if (localStorageData == null) {
            //     todoArray = [];
            // } else {
            //     todoArray = JSON.parse(localStorageData);
            // };

            // function createTodoItemObject(array) {
            //     const itemObject = {
            //         id: todoItem.item.id,
            //         name: todoItemForm.input.value,
            //         done: false,
            //     };

            //     array.push(itemObject);
            // };

            // createTodoItemObject(todoArray);
            // localStorage.setItem(listName, JSON.stringify(todoArray));

            todoList.append(todoItemElement);
            todoItemForm.input.value = '';
            todoItemForm.button.disabled = true;
        });

        return;
    }

    window.createTodoApp = createTodoApp;

})();