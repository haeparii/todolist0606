const express = require('express');
const mysql = require('mysql');
const path = require('path');
const bodyParser = require('body-parser');
const app = express();
const port = process.env.PORT || 3004;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// MySQL 연결 설정
const db = mysql.createConnection({
    host: 'localhost',
    user: 'eunki',
    password: '9027',
    database: 'todo_app'
});

// MySQL 연결
db.connect((err) => {
    if (err) {
        console.error('MySQL 연결 오류:', err);
        return;
    }
    console.log('MySQL connected...');
});

// 정적 파일 서비스
app.use(express.static(path.join(__dirname, 'public')));

// GET 요청 처리: 모든 할 일 목록 가져오기
app.get('/api/todos', (req, res) => {
    db.query('SELECT * FROM todos', (err, results) => {
        if (err) {
            console.error('조회 오류:', err);
            res.status(500).send('Server error');
            return;
        }
        res.json(results);
    });
});

// POST 요청 처리: 새 할 일 추가
app.post('/api/todos', (req, res) => {
    const newTodo = { text: req.body.text };
    db.query('INSERT INTO todos SET ?', newTodo, (err, result) => {
        if (err) {
            console.error('삽입 오류:', err);
            res.status(500).send('Server error');
            return;
        }
        res.status(201).json({ id: result.insertId, ...newTodo });
    });
});

// DELETE 요청 처리: 할 일 삭제
app.delete('/api/todos/:id', (req, res) => {
    const todoId = req.params.id;
    db.query('DELETE FROM todos WHERE id = ?', [todoId], (err, result) => {
        if (err) {
            console.error('삭제 오류:', err);
            res.status(500).send('Server error');
            return;
        }
        if (result.affectedRows === 0) {
            res.status(404).send('Todo not found');
            return;
        }
        res.status(204).send();
    });
});

// 서버 시작
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

