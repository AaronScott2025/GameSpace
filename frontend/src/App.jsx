import { useState, useEffect } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";

function App() {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    fetch("/api/tasks")
      .then((response) => response.json())
      .then((data) => {
        console.log("Fetched tasks:", data); // Debug log
        setTasks(data);
      })
      .catch((error) => console.error("Error fetching tasks:", error));
  }, []);

  return (
    <>
      <div>
        <h2>Tasks</h2>
        <ul>
          {tasks.map((task) => (
            <li key={task.id}>
              {task.title} - {task.completed ? "Completed" : "Pending"}
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

export default App;
