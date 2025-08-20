import React, { useEffect, useState } from "react";
import axios from "axios";

interface Todo {
  id: number;
  title: string;
  completed: boolean;
}

const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [title, setTitle] = useState("");
  const [editId, setEditId] = useState<number | null>(null);
  const [editTitle, setEditTitle] = useState("");

  // Ambil data todos
  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    const res = await axios.get("http://127.0.0.1:8000/api/todos");
    setTodos(res.data);
  };

  const addTodo = async () => {
    if (!title) return;
    await axios.post("http://127.0.0.1:8000/api/todos", { title });
    setTitle("");
    fetchTodos();
  };

  const startEdit = (todo: Todo) => {
    setEditId(todo.id);
    setEditTitle(todo.title);
  };

  const cancelEdit = () => {
    setEditId(null);
    setEditTitle("");
  };

  const updateTodo = async () => {
    if (editId === null || !editTitle) return;
    await axios.put(`http://127.0.0.1:8000/api/todos/${editId}`, {
      title: editTitle,
    });
    setEditId(null);
    setEditTitle("");
    fetchTodos();
  };

  const deleteTodo = async (id: number) => {
    await axios.delete(`http://127.0.0.1:8000/api/todos/${id}`);
    fetchTodos();
  };

  return (
    <div style={{ margin: "2rem" }}>
      <h1>Todo App</h1>
      {/* Input tambah todo */}
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Tambahkan todo..."
        disabled={editId !== null}
      />
      <button onClick={addTodo} disabled={editId !== null}>
        Tambah
      </button>

      {/* Input edit todo */}
      {editId !== null && (
        <div style={{ marginTop: "1rem" }}>
          <input
            type="text"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            placeholder="Edit todo..."
          />
          <button onClick={updateTodo}>Update</button>
          <button onClick={cancelEdit}>Batal</button>
        </div>
      )}

      <ul>
        {todos.map((todo) => (
          <li key={todo.id}>
            {todo.title}
            <button onClick={() => deleteTodo(todo.id)}>Hapus</button>
            <button
              onClick={() => startEdit(todo)}
              style={{ marginLeft: "0.5rem" }}
            >
              Edit
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default App;
