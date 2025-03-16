import React, { useState } from 'react';
import './taskService.css'

function TaskService({ task, onClose, onSave }) {
  const [editedTask, setEditedTask] = useState({ ...task });

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditedTask({
      ...editedTask,
      [name]: value
    });
  };

  const handleSave = () => {
    onSave(editedTask); // Save the edited task and remarks
    onClose(); // Close the modal after saving
  };

  return (
    <div className="task-service-modal">
      <div className="task-service-body">
        <div className="task-detail">
          <label>Title:</label>
          <input
            type="text"
            name="title"
            value={editedTask.title}
            onChange={handleEditChange}
          />
        </div>

        <div className="task-detail">
          <label>Description:</label>
          <textarea
            name="description"
            value={editedTask.description}
            onChange={handleEditChange}
          />
        </div>

        <div className="task-detail">
          <label>Due Date:</label>
          <input
            type="date"
            name="dueDate"
            value={editedTask.dueDate}
            onChange={handleEditChange}
          />
        </div>

        <div className="task-detail">
          <label>Priority:</label>
          <select
            name="priority"
            value={editedTask.priority}
            onChange={handleEditChange}
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>

        <div className="task-service-actions">
          <button onClick={handleSave}>Save</button>
          <button onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
}

export default TaskService;
