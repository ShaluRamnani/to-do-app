import axios from "axios";
import { useAuth0 } from "@auth0/auth0-react";
import TaskChart from "./components/TaskChart";
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

import { useEffect, useRef, useState } from "react";
import Card from './components/TodoCard';
import Loader from "./components/Loader";

const firebaseUrl = import.meta.env.VITE_FIREBASE_DB_URL;

function App() {
  const taskInput = useRef(null);
  const [priority, setPriority] = useState("low");
  const [todos, setTodos] = useState([]);
  const [formStatus, setFormStatus] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showCalendar, setShowCalendar] = useState(false);
  const { user, loginWithRedirect, isAuthenticated, logout } = useAuth0();

  const priorityOrder = { high: 0, medium: 1, low: 2 };
  

  function handleSubmit() {
    if (!user?.sub) {
      alert("User not loaded yet. Please wait.");
      return;
    }

    const task = taskInput.current.value.trim();
    if (!task) {
      alert("Task cannot be empty.");
      return;
    }

    setFormStatus(true);
    const userId = user.sub;
    


    axios.post(`${firebaseUrl}todos/${userId}.json`, {
      title: task,
      priority,
      date: selectedDate.toISOString().split('T')[0],
      completed: false,
    })
      .then(() => {
        taskInput.current.value = "";
        setFormStatus(false);
        fetchTodos();
      })
      .catch((err) => {
        console.error("Create task error:", err);
        alert("Error creating task (check console).");
        setFormStatus(false);
      });
  }

  function fetchTodos() {
    if (!user?.sub) return;
    const userId = user.sub;

    axios.get(`${firebaseUrl}todos/${userId}.json`)
      .then(response => {
        const data = response.data || {};
        const tempTodos = Object.keys(data).map(key => ({
          id: key,
          ...data[key],
        }));

        tempTodos.sort((a, b) => {
          const aPriority = priorityOrder[a.priority] ?? 3;
          const bPriority = priorityOrder[b.priority] ?? 3;
          return aPriority - bPriority;
        });

        setTodos(tempTodos);
      })
      .catch(err => {
        console.error("Fetch error:", err);
      });
  }

  function handleDelete(id) {
    if (!user?.sub) return;
    const userId = user.sub;

    axios.delete(`${firebaseUrl}todos/${userId}/${id}.json`)
      .then(() => fetchTodos())
      .catch(err => console.error("Delete error:", err));
  }

  function handleComplete(id) {
    if (!user?.sub) return;
    const userId = user.sub;

    const todo = todos.find(todo => todo.id === id);
    const updatedTodo = { ...todo, completed: !todo.completed };

    axios.put(`${firebaseUrl}todos/${userId}/${id}.json`, updatedTodo)
      .then(() => fetchTodos())
      .catch(err => console.error("Complete error:", err));
  }

  function handleEdit(id, newTitle) {
    if (!user?.sub) return;
    const userId = user.sub;

    const todo = todos.find(todo => todo.id === id);
    const updatedTodo = { ...todo, title: newTitle };

    axios.put(`${firebaseUrl}todos/${userId}/${id}.json`, updatedTodo)
      .then(() => fetchTodos())
      .catch(err => console.error("Edit error:", err));
  }

  useEffect(() => {
    if (isAuthenticated && user?.sub) {
      fetchTodos();
    }
  }, [isAuthenticated, user]);

  return (
    <>
      {isAuthenticated ? (
        <div className="absolute top-0 right-0 bg-white py-2 rounded-lg flex flex-col items-center w-40">
          <img
            src={user.picture}
            alt={user.name}
            className="w-12 h-12 rounded-full object-cover mb-3 border-2 border-emerald-500"
          />
          <button
            className="bg-emerald-600 text-white text-xs font-medium py-1 px-4 rounded-md shadow-sm transition duration-200 mt-0"
            onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}
          >
            Logout
          </button>
        </div>
      ) : (
        <div className="fixed inset-0 m-auto w-max h-max flex flex-col justify-centre">
          <h1 className="text-3xl md:text-4xl font-semibold text-center text-gray-800 leading-relaxed mt-12 px-4">
            👋 You’ve Got This!
            <br />
            <span className="text-lg md:text-xl font-normal text-gray-600">
              Log in to stay on top of your to-do list.
            </span>
            <br />
            <span className="mt-4 block italic text-sm md:text-base text-gray-500">
              "Don’t watch the clock; do what it does. Keep going." – Sam Levenson
            </span>
          </h1>
          <br />
          <button className="bg-emerald-700 text-white px-4 py-2 rounded" onClick={() => loginWithRedirect()}>
            Log In with redirect
          </button>
        </div>
      )}

      {isAuthenticated && (
        <div className="min-h-screen bg-[#fbfefc] p-4 flex justify-center">
          <div className="w-full max-w-md mt-12 px-4 sm:px-6">
            <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-lg">
              <h1 className="text-2xl font-bold text-neutral-800">
                Manage your tasks <span className="text-neutral-500">@{user.given_name}</span>
              </h1>
              <p className="text-sm text-neutral-600 mt-1">
                You don’t have to be great to start, but you have to start to be great.
              </p>
              <input
                ref={taskInput}
                className="mt-4 border border-neutral-300 rounded-xl p-3 w-full focus:outline-none focus:ring-2 focus:ring-emerald-400 transition"
                type="text"
                placeholder="Add task i.e. Learn Hooks in React"
              />
              <div className="mt-4 relative">
                <button
                  onClick={() => setShowCalendar(!showCalendar)}
                  className="w-full bg-white border border-neutral-300 rounded-xl p-3 text-left focus:outline-none focus:ring-2 focus:ring-emerald-400"
                >
                  {selectedDate ? `Due-date: ${selectedDate.toDateString()}` : "Add Date"}
                </button>

                {showCalendar && (
                  <div className="absolute z-20 mt-2">
                    <Calendar
                      onChange={(date) => {
                        setSelectedDate(date);
                        setShowCalendar(false);
                      }}
                      value={selectedDate}
                      className="rounded-lg shadow-md"
                    />
                  </div>
                )}
              </div>

              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="mt-2 border border-neutral-300 rounded-xl py-3 px-4 w-full focus:outline-none focus:ring-2 focus:ring-emerald-400 transition"
              >
                <option value="low">Low Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="high">High Priority</option>
              </select>

              <button
                onClick={handleSubmit}
                className="mt-4 bg-gradient-to-r from-emerald-400 via-emerald-500 to-emerald-600 
                  hover:from-emerald-500 hover:to-emerald-700 
                  text-white font-bold py-3 px-5 rounded-2xl w-full 
                  flex items-center justify-center gap-3 
                  transition-all duration-300 ease-in-out 
                  shadow-md hover:shadow-xl active:scale-95"
              >
                Create Todos {formStatus && <Loader />}
              </button>

              <div className="mt-10 space-y-3">
                {todos.map(todo => (
                  <Card
                    key={todo.id}
                    id={todo.id}
                    title={todo.title}
                    completed={todo.completed}
                    priority={todo.priority}
                    date={todo.date}
                    handleDelete={handleDelete}
                    handleComplete={handleComplete}
                    handleEdit={handleEdit}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="mt-40">
            <TaskChart todos={todos} />
          </div>
        </div>
      )}
    </>
  );
}

export default App;
