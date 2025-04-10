import React, { useState, useEffect } from "react";
import api from "../api";
import TaskForm from '../components/TaskForm';

import {
  Container,
  Typography,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Box
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const Todo = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [editingTask, setEditingTask] = useState(null); // For opening TaskForm
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) return;
    const fetchTasks = async () => {
      try {
        const res = await api.get("/tasks", {
          headers: { "x-auth-token": token },
        });
        setTasks(res.data);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    };
    fetchTasks();
  }, [token]);

  const handleAddTask = async () => {
    if (!newTask.trim()) return;
    try {
      const res = await api.post(
        "/tasks",
        { title: newTask },
        { headers: { "x-auth-token": token } }
      );
      setTasks([...tasks, res.data]);
      setNewTask("");
    } catch (error) {
      console.error("Error adding task", error);
    }
  };

  const handleDeleteTask = async (id) => {
    try {
      await api.delete(`/tasks/${id}`, {
        headers: { "x-auth-token": token },
      });
      setTasks(tasks.filter((task) => task._id !== id));
    } catch (error) {
      console.error("Error deleting task", error);
    }
  };

  const handleUpdateTask = async (updatedTask) => {
    try {
      const res = await api.put(
        `/tasks/${updatedTask._id}`,
        updatedTask,
        { headers: { "x-auth-token": token } }
      );
      setTasks(
        tasks.map((task) =>
          task._id === updatedTask._id ? res.data : task
        )
      );
      setEditingTask(null);
    } catch (error) {
      console.error("Error updating task", error);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 5 }}>
      <Typography variant="h4" align="center" gutterBottom>
        Your Tasks
      </Typography>

      <Box display="flex" gap={2} mb={2}>
        <TextField
          fullWidth
          variant="outlined"
          label="New Task"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
        />
        <Button variant="contained" onClick={handleAddTask}>
          Add
        </Button>
      </Box>

      <List>
        {tasks.map((task) => (
          <ListItem
            key={task._id}
            secondaryAction={
              <>
                <IconButton edge="end" onClick={() => setEditingTask(task)}>
                  <EditIcon />
                </IconButton>
                <IconButton edge="end" onClick={() => handleDeleteTask(task._id)}>
                  <DeleteIcon />
                </IconButton>
              </>
            }
          >
            <ListItemText primary={task.title} />
          </ListItem>
        ))}
      </List>

      {editingTask && (
        <TaskForm
          existingTask={editingTask}
          onSubmit={handleUpdateTask}
          onCancel={() => setEditingTask(null)}
        />
      )}
    </Container>
  );
};

export default Todo;
