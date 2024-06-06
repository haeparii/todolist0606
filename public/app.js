// 날짜 형식 함수
function getFormattedDate() {
    const date = new Date();
    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2); // 월은 0부터 시작하므로 1을 더합니다.
    const day = ('0' + date.getDate()).slice(-2);
    return `${year}년 ${month}월 ${day}일`;
}

// 페이지 로드 시 제목 업데이트 및 할 일 목록 로드
document.addEventListener('DOMContentLoaded', function() {
    const title = document.querySelector('h1');
    const formattedDate = getFormattedDate();
    title.textContent = `${formattedDate}의 할 일`;
    loadTodos();
});

document.getElementById('add-task').addEventListener('click', function() {
    const taskText = document.getElementById('new-task').value;
    if (taskText === '') return;

    addTodo(taskText);
    document.getElementById('new-task').value = '';
});

// 할 일 목록 로드
async function loadTodos() {
    const response = await fetch('/api/todos');
    const todos = await response.json();
    renderTodos(todos);
}

// 할 일 목록 렌더링
function renderTodos(todos) {
    const taskList = document.getElementById('tasks');
    taskList.innerHTML = '';
    todos.forEach((todo, index) => {
        const newTask = document.createElement('li');
        newTask.textContent = `${index + 1}. ${todo.text}`;

        const deleteButton = document.createElement('button');
        deleteButton.textContent = '완료';
        deleteButton.addEventListener('click', function() {
            deleteTodo(todo.id);
        });

        newTask.appendChild(deleteButton);
        taskList.appendChild(newTask);
    });
}

// 할 일 추가
async function addTodo(text) {
    const response = await fetch('/api/todos', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text }),
    });
    const newTodo = await response.json();
    loadTodos(); // 새 할 일 추가 후 목록 다시 로드
}

// 할 일 삭제
async function deleteTodo(id) {
    await fetch(`/api/todos/${id}`, {
        method: 'DELETE',
    });
    loadTodos(); // 할 일 삭제 후 목록 다시 로드
}

