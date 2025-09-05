require('dotenv').config(); // Load environment variables

const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const cors = require('cors');
const jwt = require('jsonwebtoken'); // Kept the first declaration
const bcrypt = require('bcryptjs');
const axios = require('axios');

console.log("OPENAI_API_KEY loaded:", process.env.OPENAI_API_KEY ? "Yes" : "No");

const errorHandler = require('./errorHandler');
const authRoutes = require('./routes/authRoutes');
const taskRoutes = require("./routes/taskRoutes");

const User = require('./models/User');
const Task = require('./models/Task'); // Import Task model
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Set up CORS first
const allowedOrigins = 
[
    "https://taskappdeployable-2815f043dfd0.herokuapp.com",
    "http://localhost:3001"
];
app.use
(cors({
    origin: allowedOrigins,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "x-auth-token"],
    credentials: true,
}));
app.options("*", cors()); // Enable preflight across all routes

// Connect to MongoDB
const MONGO_URL = process.env.REACT_APP_NODE_ENV === 'Production' ? 'mongodb+srv://n7alejandroalvarez:yt7m2aQchcu2rFUB@userstask.drlmxvh.mongodb.net/?retryWrites=true&w=majority&appName=UsersTask' : 'mongodb://localhost:27017/appDatabase';
console.log("MONGO_URL:", MONGO_URL);
console.log("REACT_APP_NODE_ENV:MongoDB:", process.env.REACT_APP_NODE_ENV);
mongoose.connect(MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.log('MongoDB connection error:', err));

// Middleware
app.use(morgan('tiny'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
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

// NLP Task Creation Route
app.post('/api/tasks/nlp', async (req, res) => {
    const { userInput } = req.body;

    if (!userInput) {
        return res.status(400).json({ error: 'userInput is required' });
    }

    try {
        const response = await axios.post(
            'https://api.openai.com/v1/chat/completions',
            {
                model: "gpt-3.5-turbo",
                messages: [
                    {
                        role: "system",
                        content: "Convert user input into a JSON task with fields: title, description, dueDate (ISO 8601), and priority (low, medium, high). Return ONLY valid JSON."
                    },
                    { role: "user", content: userInput }
                ],
                temperature: 0
            },
            {
                headers: {
                    'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        // Parse GPT response
        const taskData = JSON.parse(response.data.choices[0].message.content);

        // Attach your fixed userId here 👇
        const newTask = new Task({
            ...taskData,
            userId: "68b89ca16f7576fbab09b187"
        });

        await newTask.save();
        res.status(201).json(newTask);

    } catch (err) {
        console.error('OpenAI API error:', err.response?.data || err.message);
        res.status(500).json({ error: 'Failed to create task from NLP' });
    }
});

// Error Handling Middleware
app.use(errorHandler);
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send({ error: 'Something went wrong!' });
});

  app.get('/test', (req, res) => {
  res.send('Server is working');
});

// Catch-all route to server index.html for the frontend routes
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
  });
  
// Start Server
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
