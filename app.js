const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mysql = require('mysql');

const app = express();
const PORT = 3000;  // 변경된 포트 번호

app.use(bodyParser.json());
app.use(cors());

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '9027',  // 설정한 루트 비밀번호로 변경
    database: 'todo_app',
    charset: 'utf8'
});

db.connect(err => {
    if (err) {
        console.error('Database connection failed:', err.stack);
        return;
    }
    console.log('Connected to database.');
});

app.get('/api/todos', (req, res) => {
    db.query('SELECT * FROM todos', (error, results) => {
        if (error) throw error;
        res.json(results);
    });
});

app.post('/api/todos', (req, res) => {
    const todo = { text: req.body.text, completed: false };
    db.query('INSERT INTO todos SET ?', todo, (error, results) => {
        if (error) throw error;
        res.json({ id: results.insertId, ...todo });
    });
});

app.delete('/api/todos/:id', (req, res) => {
    db.query('DELETE FROM todos WHERE id = ?', [req.params.id], (error, results) => {
        if (error) throw error;
        res.status(204).send();
    });
});

// Serve static files
app.use(express.static('public'));

// Serve the index.html on the root route
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

