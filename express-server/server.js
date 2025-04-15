require('dotenv').config(); // Load environment variables

const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const cors = require('cors');
const jwt = require('jsonwebtoken'); // Kept the first declaration
const bcrypt = require('bcryptjs');

const errorHandler = require('./errorHandler');
const authRoutes = require('./routes/authRoutes');
const taskRoutes = require("./routes/taskRoutes");

const User = require('./models/User');
const Task = require('./models/Task'); // Import Task model
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Connect to MongoDB
const MONGO_URL = process.env.REACT_APP_NODE_ENV === 'localhost' ? 'mongodb://localhost:27017/appDatabase': 'mongodb+srv://n7alejandroalvarez:yt7m2aQchcu2rFUB@userstask.drlmxvh.mongodb.net/?retryWrites=true&w=majority&appName=UsersTask'
console.log("REACT_APP_NODE_ENV:MongoDB:", process.env.REACT_APP_NODE_ENV);
mongoose.connect(MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.log('MongoDB connection error:', err));

// Middleware
app.use(morgan('tiny'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(express.static(path.join(__dirname, 'client/build')));

// Routes
app.use("/api/tasks", taskRoutes);
app.use('/api', authRoutes);

// Route to update user role for testing
app.post('/update-role', async (req, res) => {
    const { email, newRole } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).send('User not found');
        }

        user.role = newRole;
        await user.save();

        res.send(`User's role has been updated to ${newRole}`);
    } catch (error) {
        res.status(500).send('Error updating role');
    }
});

// Error Handling Middleware
app.use(errorHandler);
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send({ error: 'Something went wrong!' });
});

// Catch-all route to server index.html for the frontend routes
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
  });
  
// Start Server
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
