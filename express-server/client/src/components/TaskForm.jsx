import React, { useState, useEffect } from 'react';
import { TextField, Button, Box, Typography, CircularProgress, Snackbar, Alert } from '@mui/material';

const TaskForm = ({ existingTask, onSubmit, onCancel }) => {
  const [title, setTitle] = useState(existingTask ? existingTask.title : '');
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (existingTask) {
      setTitle(existingTask.title);
    }
  }, [existingTask]);

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  // AI fallback function
  const createTaskWithFallback = async (taskTitle) => {
    try {
      const response = await fetch('/api/tasks/nlp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userInput: taskTitle }),
      });

      if (!response.ok) throw new Error('AI endpoint failed');
      return await response.json();
    } catch (err) {
      console.warn('AI failed, falling back:', err.message);

      try {
        const fallbackResponse = await fetch('/api/tasks', {
          method: 'POST',
          headers: { "x-auth-token": token, 'Content-Type': 'application/json' },
          body: JSON.stringify({ title: taskTitle }),
        });

        if (!fallbackResponse.ok) throw new Error('Fallback failed');
        return await fallbackResponse.json();
      } catch (fallbackErr) {
        setSnackbar({ open: true, message: 'Could not create task. Please try again later.', severity: 'error' });
        throw fallbackErr;
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    setLoading(true);

    let updatedTask;

    try {
      if (existingTask) {
        updatedTask = { ...existingTask, title };
      } else {
        updatedTask = await createTaskWithFallback(title);
      }

      setTitle('');
      setSnackbar({
        open: true,
        message: existingTask ? 'Task updated successfully ✅' : 'Task created successfully ✅',
        severity: 'success',
      });
      onSubmit(updatedTask);
    } catch (err) {
      console.error('Task creation failed:', err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
          maxWidth: 400,
          margin: '0 auto',
          padding: 3,
          backgroundColor: '#f9f9f9',
          borderRadius: 2,
        }}
      >
        <Typography variant="h6" textAlign="center">
          {existingTask ? 'Edit Task' : 'Add New Task'}
        </Typography>

        <TextField
          label="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          fullWidth
          disabled={loading}
        />

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Button type="submit" variant="contained" color="primary" disabled={loading}>
            {loading ? <CircularProgress size={24} /> : 'Save'}
          </Button>
          <Button type="button" variant="outlined" color="secondary" onClick={onCancel} disabled={loading}>
            Cancel
          </Button>
        </Box>
      </Box>

      {/* Snackbar Toast Notification */}
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
    </>
  );
};

export default TaskForm;
