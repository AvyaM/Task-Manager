import React from "react";
import TaskComponent from "./TaskComponent";
import './TaskList.css'

function TaskList({ name, tasks, onComplete, onDelete, onClick }) {

  return (
    <div className="list-container">
      <div className="list-header">
        <p>{name}</p>
      </div>
      <div className="task-list">
        {tasks.map(task => (
          <TaskComponent
            key={task.id}
            task={task}
            dueDate={task.dueDate}
            onComplete={onComplete}
            onDelete={onDelete}
            onClick={onClick}
          />
        ))}
      </div>
    </div>
  );
}

export default TaskList;
