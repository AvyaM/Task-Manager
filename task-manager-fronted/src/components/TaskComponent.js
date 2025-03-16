import React from "react";
import { FaCheckCircle, FaTrash, FaUndo } from "react-icons/fa";
import './TaskComponent.css';

function TaskComponent({ task, onComplete, onDelete, onClick }) {
  const priorityColor = task.priority === 'low' ? 'green' : task.priority === 'medium' ? 'yellow' : 'red';

  const handleComplete = (e) => {
    e.stopPropagation();
    onComplete(task.id);
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    onDelete(task.id);
  };

  return (
    <div className="task-component" onClick={() => onClick(task)}>
      <div className={`priority-circle ${priorityColor}`}></div>
      <div className="task-content">
        <h3 className="task-title">{task.title}</h3>
        <p className="task-description" title={task.description}>
        </p>
        <p className="task-due">{task.dueDate}</p>
      </div>
      <div className="task-actions">
        {task.completed ? (
          <FaUndo className="task-action-icon undo" onClick={handleComplete} />
        ) : (
          <FaCheckCircle className="task-action-icon complete" onClick={handleComplete} />
        )}
        <FaTrash className="task-action-icon delete" onClick={handleDelete} />
      </div>
    </div>
  );
}

export default TaskComponent;
