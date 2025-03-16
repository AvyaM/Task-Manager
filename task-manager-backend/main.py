from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import json
import os

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_methods=["*"],  
    allow_headers=["*"], 
)

TASKS_FILE = "tasks.json"

# Ensure tasks.json exists
if not os.path.exists(TASKS_FILE):
    with open(TASKS_FILE, "w") as f:
        json.dump([], f)


# Task Model
class Task(BaseModel):
    id: int
    title: str
    description: str
    priority: str
    dueDate: str
    completed: bool


# Load tasks from file
def load_tasks():
    with open(TASKS_FILE, "r") as f:
        return json.load(f)


# Save tasks to file
def save_tasks(tasks):
    with open(TASKS_FILE, "w") as f:
        json.dump(tasks, f, indent=4)


# API Routes

@app.get("/")
def root():
    return {"message": "FastAPI Task Manager is running!"}


@app.get("/tasks")
def get_tasks():
    return load_tasks()


@app.post("/tasks")
def add_task(task: Task):
    tasks = load_tasks()
    if any(t["id"] == task.id for t in tasks):
        raise HTTPException(status_code=400, detail="Task ID already exists")
    tasks.append(task.dict())
    save_tasks(tasks)
    return task


@app.put("/tasks/{task_id}")
def update_task(task_id: int, updated_task: Task):
    tasks = load_tasks()
    for i, task in enumerate(tasks):
        if task["id"] == task_id:
            tasks[i] = updated_task.dict()
            save_tasks(tasks)
            return updated_task
    raise HTTPException(status_code=404, detail="Task not found")


@app.delete("/tasks/{task_id}")
def delete_task(task_id: int):
    tasks = load_tasks()
    tasks = [task for task in tasks if task["id"] != task_id]
    save_tasks(tasks)
    return {"message": "Task deleted successfully"}
