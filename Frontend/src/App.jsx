
import { useEffect, useState } from "react";
import "./App.css";

const BASE_URL = "https://hussnain-todo-backend.vercel.app";
const API_URL = `${BASE_URL}/api/tasks`;

const hobbies = [
  "Cricket",
  "Badminton",
  "Coding",
  "Marketing",
  "Pool",
];

async function apiRequest(url, options = {}) {
  const response = await fetch(url, options);

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || `Request failed: ${response.status}`);
  }

  return data;
}

function App() {
  const [tasks, setTasks] = useState([]);
  const [task, setTask] = useState("");
  const [hobby, setHobby] = useState("Cricket");
  const [backendMessage, setBackendMessage] = useState("Connecting...");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Connect to backend and load tasks
  useEffect(() => {
    let ignore = false;

    async function connectBackend() {
      try {
        const healthResponse = await fetch(`${BASE_URL}/`);

        if (!healthResponse.ok) {
          throw new Error("Backend connection failed");
        }

        if (!ignore) {
          setBackendMessage("Backend Connected");
        }

        const data = await apiRequest(API_URL);

        if (!ignore) {
          setTasks(Array.isArray(data) ? data : []);
        }
      } catch (err) {
        if (!ignore) {
          setBackendMessage("Backend Connection Failed");
          setError(err.message);
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }

    connectBackend();

    return () => {
      ignore = true;
    };
  }, []);

  // Add task
  async function addTask(e) {
    e.preventDefault();

    if (!task.trim()) {
      setError("Please enter a task!");
      return;
    }

    try {
      setError("");

      const newTask = await apiRequest(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: task.trim(),
          hobby: hobby,
        }),
      });

      setTasks((previous) => [...previous, newTask]);
      setTask("");
    } catch (err) {
      setError(err.message);
    }
  }

  // Delete task
  async function deleteTask(id) {
    try {
      setError("");

      await apiRequest(`${API_URL}/${id}`, {
        method: "DELETE",
      });

      setTasks((previous) =>
        previous.filter((item) => item.id !== id)
      );
    } catch (err) {
      setError(err.message);
    }
  }

  // Edit task
  async function editTask(item) {
    const updatedText = window.prompt(
      "Enter updated task:",
      item.text
    );

    if (updatedText === null || !updatedText.trim()) {
      return;
    }

    try {
      setError("");

      const updatedTask = await apiRequest(`${API_URL}/${item.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: updatedText.trim(),
        }),
      });

      setTasks((previous) =>
        previous.map((taskItem) =>
          taskItem.id === item.id ? updatedTask : taskItem
        )
      );
    } catch (err) {
      setError(err.message);
    }
  }

  // Complete task
  async function toggleTask(item) {
    try {
      setError("");

      const updatedTask = await apiRequest(`${API_URL}/${item.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          completed: !item.completed,
        }),
      });

      setTasks((previous) =>
        previous.map((taskItem) =>
          taskItem.id === item.id ? updatedTask : taskItem
        )
      );
    } catch (err) {
      setError(err.message);
    }
  }

  const completedCount = tasks.filter(
    (item) => item.completed
  ).length;

  const styles = {
    page: {
      minHeight: "100vh",
      background: "linear-gradient(135deg, #07152f, #102b50)",
      padding: "40px 18px",
      color: "white",
      fontFamily: "Arial, sans-serif",
    },
    container: {
      maxWidth: "750px",
      margin: "auto",
    },
    heading: {
      textAlign: "center",
      fontSize: "36px",
      fontWeight: "bold",
      marginBottom: "8px",
    },
    subtitle: {
      textAlign: "center",
      color: "#b8c9df",
      marginBottom: "25px",
    },
    status: {
      textAlign: "center",
      color: backendMessage === "Backend Connected"
        ? "#69f0ae"
        : "#ffcc80",
      marginBottom: "22px",
      fontWeight: "bold",
    },
    card: {
      background: "#152d4d",
      padding: "24px",
      borderRadius: "16px",
      marginBottom: "22px",
      boxShadow: "0 8px 25px rgba(0,0,0,0.25)",
    },
    input: {
      width: "100%",
      padding: "14px",
      borderRadius: "9px",
      border: "1px solid #526987",
      background: "#f5f8ff",
      color: "#14233d",
      fontSize: "16px",
      marginBottom: "13px",
      boxSizing: "border-box",
    },
    addButton: {
      width: "100%",
      padding: "14px",
      border: "none",
      borderRadius: "9px",
      background: "#35d07f",
      color: "#071c2e",
      fontWeight: "bold",
      fontSize: "16px",
      cursor: "pointer",
    },
    taskCard: {
      background: "#203c60",
      padding: "17px",
      borderRadius: "11px",
      marginBottom: "13px",
      border: "1px solid #365477",
    },
    actionButton: {
      border: "none",
      padding: "9px 13px",
      borderRadius: "7px",
      cursor: "pointer",
      fontWeight: "bold",
      marginRight: "8px",
      marginTop: "12px",
    },
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>

        <h1 style={styles.heading}>
          HUSSAIN TO DO LIST
        </h1>

        <p style={styles.subtitle}>
          Organize Your Tasks • Build Good Habits
        </p>

        <div style={styles.status}>
          ● {backendMessage}
        </div>

        <div style={styles.card}>
          <h2>Add New Task</h2>

          <form onSubmit={addTask}>
            <input
              style={styles.input}
              type="text"
              placeholder="Enter your task..."
              value={task}
              onChange={(e) => setTask(e.target.value)}
            />

            <select
              style={styles.input}
              value={hobby}
              onChange={(e) => setHobby(e.target.value)}
            >
              {hobbies.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>

            <button style={styles.addButton} type="submit">
              + ADD TASK
            </button>
          </form>

          {error && (
            <p style={{ color: "#ff8585", marginTop: "15px" }}>
              {error}
            </p>
          )}
        </div>

        <div style={styles.card}>
          <h2>My Tasks</h2>

          <p style={{ color: "#bdcde0" }}>
            Total: {tasks.length} |
            Completed: {completedCount} |
            Pending: {tasks.length - completedCount}
          </p>

          {loading && <p>Loading tasks...</p>}

          {!loading && tasks.length === 0 && (
            <p style={{ color: "#bdcde0" }}>
              No tasks yet. Add your first task!
            </p>
          )}

          {tasks.map((item) => (
            <div key={item.id} style={styles.taskCard}>
              <h3
                style={{
                  textDecoration: item.completed
                    ? "line-through"
                    : "none",
                  color: item.completed ? "#8ba4bd" : "white",
                }}
              >
                {item.text}
              </h3>

              <p style={{ color: "#b8c9df" }}>
                Hobby: {item.hobby}
              </p>

              <p style={{ color: item.completed ? "#69f0ae" : "#ffcc80" }}>
                {item.completed ? "Completed" : "Pending"}
              </p>

              <button
                style={{
                  ...styles.actionButton,
                  background: "#35d07f",
                  color: "#071c2e",
                }}
                onClick={() => toggleTask(item)}
              >
                {item.completed ? "Undo" : "Complete"}
              </button>

              <button
                style={{
                  ...styles.actionButton,
                  background: "#ffca50",
                  color: "#17243a",
                }}
                onClick={() => editTask(item)}
              >
                Edit
              </button>

              <button
                style={{
                  ...styles.actionButton,
                  background: "#ff5555",
                  color: "white",
                }}
                onClick={() => deleteTask(item.id)}
              >
                Delete
              </button>
            </div>
          ))}
        </div>

        <p style={{ textAlign: "center", color: "#a9bdd6" }}>
          Made with React & Express
        </p>

      </div>
    </div>
  );
}

export default App;
