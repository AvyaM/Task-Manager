import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import './AddTask.css';

function AddTask({ onAdd, onClose }) {
  const navigate = useNavigate();
  const [task, setTask] = useState({
    title: "",
    description: "",
    dueDate: "",
    priority: "low",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTask({
      ...task,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    if (task.title && task.dueDate) {
      onAdd(task); 
      onClose();   
      navigate('/');
    } else {
      alert("Please fill in all fields.");
    }
  };

  return (
    <div className="add-task-modal">
      <div className="add-task-container">
        <h2>Add New Task</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Title:</label>
            <input
              type="text"
              name="title"
              value={task.title}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Description:</label>
            <textarea
              name="description"
              value={task.description}
              onChange={handleInputChange}
            />
          </div>
          <div className="form-group">
            <label>Due Date:</label>
            <input
              type="date"
              name="dueDate"
              value={task.dueDate}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Priority:</label>
            <select
              name="priority"
              value={task.priority}
              onChange={handleInputChange}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
          <div className="form-actions">
            <button type="submit" className="add-btn">
              Add Task
            </button>
            <button type="button" className="cancel-btn" onClick={onClose}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddTask;
