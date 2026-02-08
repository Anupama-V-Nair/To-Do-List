import { useEffect, useMemo, useState } from "react";
import Navbar from './components/Navbar';

export default function TodoApp() {
  const [todos, setTodos] = useState(() => {
    const saved = localStorage.getItem("todos");
    return saved ? JSON.parse(saved) : [];
  });
  const [text, setText] = useState("");
  const [editingId, setEditingId] = useState(null);
  
  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);

  const addOrUpdate = () => {
    if (!text.trim()) return;
    if (editingId) {
      setTodos(todos.map(t => (t.id === editingId ? { ...t, text } : t)));
      setEditingId(null);
    } else {
      setTodos([{ id: crypto.randomUUID(), text, completed: false }, ...todos]);
    }
    setText("");
  };

  const editTodo = (id) => {
    const t = todos.find(x => x.id === id);
    if (!t) return;
    setText(t.text);
    setEditingId(id);
  };

  const deleteTodo = (id) => setTodos(todos.filter(t => t.id !== id));

  const toggleTodo = (id) => {
    setTodos(todos.map(t =>
      t.id === id ? { ...t, completed: !t.completed } : t
    ));
  };

  const completedTodos = todos.filter(t => t.completed);
  const activeTodos = todos.filter(t => !t.completed);


  return (
    <>
      <Navbar/>

      <div className="min-h-screen mx-auto bg-blue-50  text-zinc-900  rounded-2xl shadow p-6">
        {/* Title */}
        <h1 className="text-2xl font-bold text-center mb-8 text-zinc-900 ">
          TO DO LIST
        </h1>
        {/* Input Row */}
        <div className="flex gap-3 mb-6">
          <input
            value={text}
            onChange={e => setText(e.target.value)}
            onKeyDown={e => e.key === "Enter" && addOrUpdate()}
            placeholder="Add task"
            className="flex-1 border rounded px-4 py-2 bg-transparent border-blue-900"
          />

          <button
            onClick={addOrUpdate}
            className="px-6 py-2 rounded bg-blue-600 text-white "
          >
            {editingId ? "UPDATE" : "ADD"}
          </button>
        </div>

        {/* Two-columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 ">

          {/* Left column for completed task */}
          <div className="border rounded p-4 border-blue-900 ">
            <h2 className="font-semibold mb-3">COMPLETED</h2>

            <ul className="space-y-2">
              {completedTodos.map(t => (
                <li
                  key={t.id}
                  className="flex items-center gap-3 border rounded px-3 py-2 border-blue-900"
                >
                  <input
                    type="checkbox"
                    checked
                    onChange={() => toggleTodo(t.id)}
                  />

                  <span className="line-through flex-1 opacity-70">
                    {t.text}
                  </span>
                </li>
              ))}

              {!completedTodos.length && (
                <li className="text-sm opacity-60">No completed tasks</li>
              )}
            </ul>
          </div>


          {/* Right column for Added list */}
          <div className="border rounded p-4 border-blue-900">
            <h2 className="font-semibold mb-3">ADDED LIST</h2>

            <ul className="space-y-2">
              {activeTodos.map(t => (
                <li
                  key={t.id}
                  className="flex items-center gap-3 border rounded px-3 py-2 border-blue-900"
                >
                  <input
                    type="checkbox"
                    checked={false}
                    onChange={() => toggleTodo(t.id)}
                  />

                  <span className="flex-1">{t.text}</span>

                  <div className="flex gap-2">
                    <button
                      onClick={() => editTodo(t.id)}
                      className="text-sm text-white border rounded-xl px-2 py-1 bg-blue-500"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteTodo(t.id)}
                      className="text-sm text-white border rounded-xl px-2 py-1 bg-blue-500"
                    >
                      Delete
                    </button>
                  </div>
                </li>
              ))}

              {!activeTodos.length && (
                <li className="text-sm opacity-60">No active tasks</li>
              )}
            </ul>
          </div>

        </div>
      </div>

    </>

  );
}

