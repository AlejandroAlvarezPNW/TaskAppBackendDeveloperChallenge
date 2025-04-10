const { body, validationResult } = require('express-validator');
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

const app = express();
const PORT = process.env.PORT || 3000;

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.log('MongoDB connection error:', err));

// Middleware
app.use(morgan('tiny'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Routes
app.use("/api/tasks", taskRoutes);
app.use('/api', authRoutes);

// Registration route
app.post('/register', [
    body('email').isEmail().withMessage('Please provide a valid email'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    body('name').notEmpty().withMessage('Name is required'),
    body('username').notEmpty().withMessage('Username is required')
], async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const { name, username, email, password, role } = req.body;
        const userRole = role || 'user';
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            name,
            username,
            email,
            password: hashedPassword,
            role: userRole
        });

        await newUser.save();
        res.status(201).send('User registered');
    } catch (error) {
        next(error);
    }
});


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

// Start Server
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
