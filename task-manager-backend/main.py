from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import psycopg2
from typing import List

# FastAPI instance
app = FastAPI()

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# PostgreSQL Configuration
DATABASE_URL = "postgresql://training6:training6@ai-training-db.c8qwljqpukqy.us-east-1.rds.amazonaws.com/test"

TABLE_NAME = "taskmanager_avya"

# Function to get DB connection
def get_db_connection():
    return psycopg2.connect(DATABASE_URL)

# Pydantic Model for Task
class Task(BaseModel):
    title: str
    description: str
    priority: str
    dueDate: str
    completed: bool = False

# Root Endpoint
@app.get("/")
def root():
    return {"message": "FastAPI Task Manager with PostgreSQL (test schema) is running!"}

# Fetch All Tasks
@app.get("/tasks")
def get_tasks():
    conn = get_db_connection()
    cur = conn.cursor()
    
    cur.execute(f'SELECT id, title, description, priority, dueDate, completed FROM {TABLE_NAME}')
    tasks = cur.fetchall()
    
    cur.close()
    conn.close()
    return [
        {"id": row[0], "title": row[1], "description": row[2], "priority": row[3], "dueDate": row[4], "completed": row[5]}
        for row in tasks
    ]

# Add a New Task
@app.post("/tasks")
def add_task(task: Task):
    conn = get_db_connection()
    cur = conn.cursor()
    
    cur.execute(
        f'INSERT INTO {TABLE_NAME} (title, description, priority, dueDate, completed) VALUES (%s, %s, %s, %s, %s) RETURNING id',
        (task.title, task.description, task.priority, task.dueDate, task.completed)
    )
    task_id = cur.fetchone()[0]
    
    conn.commit()
    cur.close()
    conn.close()
    
    return {"id": task_id, "message": "Task added successfully"}

# Update a Task
@app.put("/tasks/{task_id}")
def update_task(task_id: int, updated_task: Task):
    conn = get_db_connection()
    cur = conn.cursor()
    
    cur.execute(
        f'UPDATE {TABLE_NAME} SET title = %s, description = %s, priority = %s, dueDate = %s, completed = %s WHERE id = %s',
        (updated_task.title, updated_task.description, updated_task.priority, updated_task.dueDate, updated_task.completed, task_id)
    )
    
    if cur.rowcount == 0:
        cur.close()
        conn.close()
        raise HTTPException(status_code=404, detail="Task not found")
    
    conn.commit()
    cur.close()
    conn.close()
    
    return {"message": "Task updated successfully"}

# Delete a Task
@app.delete("/tasks/{task_id}")
def delete_task(task_id: int):
    conn = get_db_connection()
    cur = conn.cursor()
    
    cur.execute(f'DELETE FROM {TABLE_NAME} WHERE id = %s', (task_id,))
    
    if cur.rowcount == 0:
        cur.close()
        conn.close()
        raise HTTPException(status_code=404, detail="Task not found")
    
    conn.commit()
    cur.close()
    conn.close()
    
    return {"message": "Task deleted successfully"}
