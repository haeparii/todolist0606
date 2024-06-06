document.addEventListener('DOMContentLoaded', function() {
    const todoList = document.getElementById('todo-list');
    const newTodoForm = document.getElementById('new-todo-form');
    const newTodoInput = document.getElementById('new-todo-input');

    // 할 일 목록 로드
    fetch('/api/todos')
        .then(response => response.json())
        .then(todos => {
            todos.forEach(todo => {
                const li = createTodoElement(todo);
                todoList.appendChild(li);
            });
        });

    // 새 할 일 추가
    newTodoForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const text = newTodoInput.value.trim();
        if (text !== '') {
            fetch('/api/todos', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ text })
            })
            .then(response => response.json())
            .then(todo => {
                const li = createTodoElement(todo);
                todoList.appendChild(li);
                newTodoInput.value = '';
            });
        }
    });

    // 할 일 요소 생성
    function createTodoElement(todo) {
        const li = document.createElement('li');
        li.textContent = todo.text;
        li.dataset.id = todo.id;

        const deleteButton = document.createElement('button');
        deleteButton.textContent = '완료';
        deleteButton.addEventListener('click', function() {
            fetch(`/api/todos/${todo.id}`, {
                method: 'DELETE'
            })
            .then(response => {
                if (response.ok) {
                    li.remove();
                }
            });
        });

        li.appendChild(deleteButton);
        return li;
    }
});

