import { useEffect, useState } from "react";
import "./App.css";

const API_URL = "http://localhost:5000/api/tasks";

function App() {
  const [tasks, setTasks] = useState([]);
  const [task, setTask] = useState("");
  const [hobby, setHobby] = useState("Cricket");
  const [backendMessage, setBackendMessage] = useState("");

  const hobbies = [
    "Cricket",
    "Badminton",
    "Coding",
    "Marketing",
    "Pool",
  ];

  // Backend connection
  useEffect(() => {
    fetch("http://localhost:5000/")
      .then((response) => response.json())
      .then((data) => setBackendMessage(data.message))
      .catch(() => setBackendMessage("Backend connection failed"));

    loadTasks();
  }, []);

  // Get tasks from backend
  const loadTasks = () => {
    fetch(API_URL)
      .then((response) => response.json())
      .then((data) => setTasks(data))
      .catch((error) => console.log(error));
  };

  // Add task to backend
  const addTask = async () => {
    if (task.trim() === "") return;

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: task,
          hobby: hobby,
        }),
      });

      const newTask = await response.json();

      setTasks([...tasks, newTask]);
      setTask("");
    } catch (error) {
      console.log("Error adding task:", error);
    }
  };

  // Delete task from backend
  const deleteTask = async (id) => {
    try {
      await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
      });

      setTasks(tasks.filter((item) => item.id !== id));
    } catch (error) {
      console.log("Error deleting task:", error);
    }
  };

  // Complete / Undo task
  const toggleComplete = async (id) => {
    const currentTask = tasks.find((item) => item.id === id);

    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          completed: !currentTask.completed,
        }),
      });

      const updatedTask = await response.json();

      setTasks(
        tasks.map((item) =>
          item.id === id ? updatedTask : item
        )
      );
    } catch (error) {
      console.log("Error updating task:", error);
    }
  };

  // Edit task
  const editTask = async (id) => {
    const currentTask = tasks.find((item) => item.id === id);

    const newText = prompt(
      "Enter new task:",
      currentTask.text
    );

    if (!newText || newText.trim() === "") return;

    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: newText,
        }),
      });

      const updatedTask = await response.json();

      setTasks(
        tasks.map((item) =>
          item.id === id ? updatedTask : item
        )
      );
    } catch (error) {
      console.log("Error editing task:", error);
    }
  };

  return (
    <div className="app">
      <div className="container">

        <h1>Hussnain To Do List</h1>

        <p className="subtitle">
          Manage your daily tasks and hobbies
        </p>

        <div className="backend-status">
          <span>Backend Status:</span>

          <strong>
            {backendMessage}
          </strong>
        </div>

        <div className="input-section">

          <input
            type="text"
            placeholder="Enter your task..."
            value={task}
            onChange={(e) => setTask(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                addTask();
              }
            }}
          />

          <select
            value={hobby}
            onChange={(e) => setHobby(e.target.value)}
          >
            {hobbies.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>

          <button
            onClick={addTask}
            className="add-btn"
          >
            + Add Task
          </button>

        </div>

        <div className="hobbies">

          <h2>My Hobbies</h2>

          <div className="hobby-list">

            {hobbies.map((item) => (
              <span
                key={item}
                className="hobby"
              >
                {item}
              </span>
            ))}

          </div>

        </div>

        <div className="tasks">

          <h2>My Tasks</h2>

          {tasks.length === 0 ? (
            <p className="empty">
              No tasks added yet.
            </p>
          ) : (

            tasks.map((item) => (
              <div
                className={`task-card ${
                  item.completed
                    ? "completed"
                    : ""
                }`}
                key={item.id}
              >

                <div className="task-info">

                  <h3>
                    {item.text}
                  </h3>

                  <span className="task-hobby">
                    {item.hobby}
                  </span>

                </div>

                <div className="buttons">

                  <button
                    onClick={() =>
                      toggleComplete(item.id)
                    }
                    className="complete-btn"
                  >
                    {item.completed
                      ? "Undo"
                      : "Done"}
                  </button>

                  <button
                    onClick={() =>
                      editTask(item.id)
                    }
                    className="edit-btn"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() =>
                      deleteTask(item.id)
                    }
                    className="delete-btn"
                  >
                    Delete
                  </button>

                </div>

              </div>
            ))

          )}

        </div>

        <div className="footer">
          Built with React + Node.js + Express
        </div>

      </div>
    </div>
  );
}

export default App;