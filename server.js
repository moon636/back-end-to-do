// 1. Import necessary modules
const express = require('express');
const fs = require('fs');
const path = require('path');

// 2. Create an Express application
const app = express();
const PORT = 3000;

// 3. Middleware
// This allows the server to understand JSON data sent from the front-end
app.use(express.json());
// This serves the static files (HTML, CSS, JS) from the 'public' directory
app.use(express.static('public'));

const dbFilePath = path.join(__dirname, 'db.json');

// 4. API Routes (Endpoints)

// GET /api/todos - Get all to-do items
app.get('/api/todos', (req, res) => {
    fs.readFile(dbFilePath, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).send('Error reading database file.');
        }
        res.json(JSON.parse(data));
    });
});

// POST /api/todos - Add a new to-do item
app.post('/api/todos', (req, res) => {
    fs.readFile(dbFilePath, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).send('Error reading database file.');
        }
        const todos = JSON.parse(data);
        const newTodo = {
            id: Date.now(), // Use a timestamp as a unique ID
            text: req.body.text,
            completed: false
        };
        todos.push(newTodo);
        fs.writeFile(dbFilePath, JSON.stringify(todos, null, 2), (err) => {
            if (err) {
                return res.status(500).send('Error writing to database file.');
            }
            res.status(201).json(newTodo);
        });
    });
});

// DELETE /api/todos/:id - Delete a to-do item
app.delete('/api/todos/:id', (req, res) => {
    const todoId = parseInt(req.params.id, 10);
    fs.readFile(dbFilePath, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).send('Error reading database file.');
        }
        let todos = JSON.parse(data);
        todos = todos.filter(todo => todo.id !== todoId);
        fs.writeFile(dbFilePath, JSON.stringify(todos, null, 2), (err) => {
            if (err) {
                return res.status(500).send('Error writing to database file.');
            }
            res.status(200).send('To-do deleted.');
        });
    });
});

app.patch('/api/todos/:id', (req, res) => {
    const todoId = req.params.id;
    fs.readFile(dbFilePath, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).send('Error reading database file.');
        }
        const todos = JSON.parse(data);
        const todo = todos.find(todo => todo.id === parseInt(todoId, 10));
        if (!todo) {
            console.log('To-do not found for id:', todoId);
            return res.status(404).send('To-do not found.');
        }
        todo.completed = !todo.completed; // Toggle completion status
        fs.writeFile(dbFilePath, JSON.stringify(todos, null, 2), (err) => {
            if (err) {
                return res.status(500).send('Error writing to database file.');
            }
            res.status(200).json(todo);
        });
    });
});

// 5. Start the server
app.listen(PORT, () => {
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
});