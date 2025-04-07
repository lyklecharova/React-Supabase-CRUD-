import supabase from './supbase-client';
import './App.css';
import { useEffect, useState } from 'react';

function App() {
    const [todoList, setTodoList] = useState([]);
    const [newTodo, setNewTodo] = useState('');

    useEffect(() => {
        fetchTodos();
    }, []);

    const fetchTodos = async () => {
        const { data, error } = await supabase.from('TodoList').select('*');
        if (error) {
            console.log('Error fetching: ', error);
        } else {
            setTodoList(data);
        }
    };

    const addTodo = async () => {
        const newTodoData = {
            name: newTodo,
            isCompleted: false
        };
        const { data, error } = await supabase
            .from('TodoList')
            .insert([newTodoData])
            .single();

        if (error) {
            console.log('Error adding todo: ', error);
        } else {
            setTodoList((prev) => [...prev, data]);
            setNewTodo('');
        }
    };

    const completeTask = async (id, isCompleted) => {
        const { data, error } = await supabase
            .from('TodoList')
            .update({ isCompleted: !isCompleted })
            .eq('id', id);

        if (error) {
            console.log('Error toggling task: ', error);
        } else {
            const updatedTodoList = todoList.map((todo) =>
                todo.id === id ? { ...todo, isCompleted: !isCompleted } : todo
            );
            setTodoList(updatedTodoList);
        }
    };

    const deleteTask = async (id) => {
        const { data, error } = await supabase
            .from('TodoList')
            .delete()
            .eq('id', id);

        if (error) {
            console.log('Error deleting task: ', error);
        } else {
            setTodoList((prev) => prev.filter((todo) => todo.id !== id));
        }
    };
    return (
        <div>
            {''}
            <h1>Todo List</h1>
            <div>
                <input
                    type="text"
                    placeholder="New Todo..."
                    value={newTodo}
                    onChange={(e) => setNewTodo(e.target.value)}
                />
                <button onClick={addTodo}>Add Todo Item</button>
            </div>

            <ul>
                {todoList.map((todo) => (
                    <li key={todo.id}>
                        <p>{todo.name}</p>
                        <button
                            onClick={() =>
                                completeTask(todo.id, todo.isComplete)
                            }
                        >
                            {todo.isCompleted ? 'Undo' : 'Complete Task'}
                        </button>
                        <button onClick={() => deleteTask(todo.id)}>
                            Delete Task
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default App;
