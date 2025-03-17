import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { IoAddCircleOutline } from "react-icons/io5";
import TaskList from './components/TaskList';
import NavBar from './components/NavBar';
import AddTask from './components/AddTask';
import TaskService from './components/TaskService';
import './App.css';

function App() {
  const [tasks, setTasks] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  // Fetch tasks from FastAPI when component mounts
  const fetchTasks = () => {
    fetch( `${process.env.REACT_APP_API_URL_LOCAL}/tasks`)
      .then(response => response.json())
      .then(data => setTasks(data))
      .catch(error => alert("Error fetching tasks:", error));
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleAddTask = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const handleTaskClick = (task) => {
    setSelectedTask(task);
  };

  // Add a new task using FastAPI POST endpoint
  const handleNewTask = (newTask) => {
    const newId = tasks.length > 0 ? Math.max(...tasks.map(task => task.id)) + 1 : 1;
    const taskToSend = { ...newTask, id: newId, completed: false };
    
    fetch(`${process.env.REACT_APP_API_URL_LOCAL}/tasks`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(taskToSend)
    })
      .then(response => response.json())
      .then(data => {
        setTasks(prevTasks => [...prevTasks, data]);
        closeModal();
      })
      .catch(error => alert("Error adding task:", error));
  };

  // Toggle task completed status via FastAPI PUT endpoint
  const handleComplete = (taskId) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;
    const updatedTask = { ...task, completed: !task.completed };
    fetch(`${process.env.REACT_APP_API_URL_LOCAL}/tasks/${taskId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedTask)
    })
      .then(response => response.json())
      .then(data => {
        setTasks(prevTasks => prevTasks.map(t => t.id === taskId ? data : t));
      })
      .catch(error => alert("Error updating task:", error));
  };

  // Delete task using FastAPI DELETE endpoint
  const handleDelete = (taskId) => {
    fetch(`${process.env.REACT_APP_API_URL_LOCAL}/tasks/${taskId}`, {
      method: "DELETE",
    })
      .then(() => {
        setTasks(prevTasks => prevTasks.filter(t => t.id !== taskId));
      })
      .catch(error => alert("Error deleting task:", error));
      alert("Delete Successfully")
  };

  // Save edited task via FastAPI PUT endpoint
  const handleSaveEditedTask = (updatedTask) => {
    fetch(`${process.env.REACT_APP_API_URL_LOCAL}/tasks/${updatedTask.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedTask)
    })
      .then(response => response.json())
      .then(data => {
        setTasks(prevTasks => prevTasks.map(t => t.id === data.id ? data : t));
        setSelectedTask(null);
      })
      .catch(error => alert("Error editing task:", error));

      alert("Edit Successfully")
  };

  // Date calculations for filtering tasks
  const date = new Date();
  const today = date.toISOString().split('T')[0];
  const dueTodayTasks = tasks.filter(task => task.dueDate === today && !task.completed);
  const dueWithinWeekTasks = tasks.filter(task => {
    const taskDate = new Date(task.dueDate);
    const diffDays = (taskDate - date) / (1000 * 60 * 60 * 24);
    return diffDays > 0 && diffDays <= 7 && !task.completed;
  });
  const dueLaterTasks = tasks.filter(task => {
    const taskDate = new Date(task.dueDate);
    const diffDays = (taskDate - date) / (1000 * 60 * 60 * 24);
    return diffDays > 7 && !task.completed;
  });
  const completedTasks = tasks.filter(task => task.completed);
  const overDueTasks = tasks.filter(task => task.dueDate < today && !task.completed);

  return (
    <Router>
      <div className="App">
        <NavBar onAddTask={handleAddTask} />

        {showModal && <AddTask onAdd={handleNewTask} onClose={closeModal} />}

        {selectedTask && (
          <TaskService 
            task={selectedTask} 
            onClose={() => setSelectedTask(null)}
            onSave={handleSaveEditedTask}
          />
        )}

        <div className="content">
          <h1 className="app-heading">Task Manager</h1>
          <div className="main-content">
            <Routes>
              <Route path="/" element={
                <>
                  <TaskList
                    name="Due Today"
                    tasks={dueTodayTasks}
                    onComplete={handleComplete}
                    onDelete={handleDelete}
                    onClick={handleTaskClick}
                  />
                  <TaskList
                    name="Due within a week"
                    tasks={dueWithinWeekTasks}
                    onComplete={handleComplete}
                    onDelete={handleDelete}
                    onClick={handleTaskClick}
                  />
                  <TaskList
                    name="Due later"
                    tasks={dueLaterTasks}
                    onComplete={handleComplete}
                    onDelete={handleDelete}
                    onClick={handleTaskClick}
                  />
                </>
              } />
              <Route path="/completed" element={
                <TaskList
                  name="Completed"
                  tasks={completedTasks}
                  onComplete={handleComplete}
                  onDelete={handleDelete}
                  onClick={handleTaskClick}
                />
              } />
              <Route path="/overDue" element={
                <TaskList
                  name="Over Due"
                  tasks={overDueTasks}
                  onComplete={handleComplete}
                  onDelete={handleDelete}
                  onClick={handleTaskClick}
                />
              } />
            </Routes>
              <button className="add-task-button" onClick={handleAddTask}>
                <IoAddCircleOutline className="add-task-button-icon"/>
                Add Task
              </button>
            
          </div>
        </div>
      </div>
    </Router>
  );
}

export default App;
