const form = document.getElementById('todo-form');
const input = document.getElementById('todo-input');
const todoList = document.getElementById('todo-list');

// Function to fetch todos from the server and display them
const getTodos = async () => {
    try {
        const response = await fetch('/api/todos');
        const todos = await response.json();

        // Clear the list before re-rendering
        todoList.innerHTML = '';

        todos.forEach(todo => {
            const li = document.createElement('li');
            li.textContent = todo.text;
            li.dataset.id = todo.id; // Store the ID in a data attribute

            // Style completed todos
            if (todo.completed) {
                li.style.textDecoration = 'line-through';
                li.style.color = '#888';
            } else {
                li.style.textDecoration = 'none';
                li.style.color = '';
            }

            // Complete button
            const completeBtn = document.createElement('button');
            completeBtn.textContent = 'Complete';
            completeBtn.classList.add('complete-btn');
            li.appendChild(completeBtn);

            // Delete button
            const deleteBtn = document.createElement('button');
            deleteBtn.textContent = 'Delete';
            deleteBtn.classList.add('delete-btn');
            li.appendChild(deleteBtn);

            todoList.appendChild(li);
        });
    } catch (error) {
        console.error('Failed to fetch todos:', error);
    }
};

// Event listener for form submission (to add a new todo)
form.addEventListener('submit', async (e) => {
    e.preventDefault(); // Prevent page refresh
    const text = input.value.trim();

    if (text) {
        try {
            await fetch('/api/todos', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ text: text }),
            });
            input.value = ''; // Clear the input field
            getTodos(); // Refresh the list
        } catch (error) {
            console.error('Failed to add todo:', error);
        }
    }
});

// Event listener for clicks on the delete button
todoList.addEventListener('click', async (e) => {
    if (e.target.classList.contains('delete-btn')) {
        const id = e.target.parentElement.dataset.id;
        try {
            await fetch(`/api/todos/${id}`, {
                method: 'DELETE',
            });
            getTodos(); // Refresh the list
        } catch (error) {
            console.error('Failed to delete todo:', error);
        }
    }

    if (e.target.classList.contains('complete-btn')) {
        const id = e.target.parentElement.dataset.id;
        try {
            await fetch(`/api/todos/${id}`, {
                method: 'PATCH',
            });
            getTodos(); // Refresh the list
        } catch (error) {
            console.error('Failed to toggle complete todo:', error);
        }
    }
});

// Initial fetch of todos when the page loads
getTodos();