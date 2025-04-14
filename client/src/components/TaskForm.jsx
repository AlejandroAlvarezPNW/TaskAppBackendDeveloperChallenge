import React, { useState, useEffect } from 'react';
import { TextField, Button, Box, Typography } from '@mui/material';

const TaskForm = ({ existingTask, onSubmit, onCancel }) => {
  const [title, setTitle] = useState(existingTask ? existingTask.title : '');

  useEffect(() => {
    if (existingTask) {
      setTitle(existingTask.title);
    }
  }, [existingTask]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const updatedTask = {
      ...existingTask,
      title,
    };

    onSubmit(updatedTask);
  };

  return (
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
        Edit Task
      </Typography>

      <TextField
        label="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
        fullWidth
      />

      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Button type="submit" variant="contained" color="primary">
          Save
        </Button>
        <Button type="button" variant="outlined" color="secondary" onClick={onCancel}>
          Cancel
        </Button>
      </Box>
    </Box>
  );
};

export default TaskForm;
