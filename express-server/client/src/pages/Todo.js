import React, { useState, useEffect } from "react";
import api from "../api";
import TaskForm from '../components/TaskForm';
import {
  Container,
  Typography,
  Box,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Button,
  CircularProgress,
  Snackbar,
  Alert
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const Todo = () => {
  const [tasks, setTasks] = useState([]);
  const [showNewTaskForm, setShowNewTaskForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [loading, setLoading] = useState(false); // general loading
  const [loadingNewTask, setLoadingNewTask] = useState(false); // new task button spinner
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

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
        setSnackbar({ open: true, message: "Failed to fetch tasks ❌", severity: "error" });
      }
    };
    fetchTasks();
  }, [token]);

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  // Handle new task submission
  const handleAddTask = async (task) => {
    setLoadingNewTask(true); // start spinner
    setTasks((prevTasks) => [...prevTasks, task]);
    setShowNewTaskForm(false);
    setSnackbar({ open: true, message: "Task added successfully ✅", severity: "success" });
    setLoadingNewTask(false); // stop spinner
  };

  const handleUpdateTask = (updatedTask) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) => (task._id === updatedTask._id ? updatedTask : task))
    );
    setEditingTask(null);
    setSnackbar({ open: true, message: "Task updated successfully ✅", severity: "success" });
  };

  const handleDeleteTask = async (id) => {
    try {
      await api.delete(`/tasks/${id}`, {
        headers: { "x-auth-token": token },
      });
      setTasks(tasks.filter((task) => task._id !== id));
      setSnackbar({ open: true, message: "Task deleted successfully 🗑️", severity: "success" });
    } catch (error) {
      console.error("Error deleting task", error);
      setSnackbar({ open: true, message: "Failed to delete task ❌", severity: "error" });
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 5 }}>
      <Typography variant="h4" align="center" gutterBottom>
        Your Tasks
      </Typography>

      {showNewTaskForm ? (
        <TaskForm
          onSubmit={handleAddTask} 
          onCancel={() => setShowNewTaskForm(false)}
        />
      ) : (
        <Button
          variant="contained"
          onClick={() => setShowNewTaskForm(true)}
          sx={{ mb: 2 }}
          disabled={loadingNewTask} // disable button while creating
        >
          {loadingNewTask ? <CircularProgress size={24} /> : 'Add New Task'}
        </Button>
      )}

      {loading && (
        <Box display="flex" justifyContent="center" my={2}>
          <CircularProgress />
        </Box>
      )}

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

      {/* Snackbar Toast Notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Todo;
