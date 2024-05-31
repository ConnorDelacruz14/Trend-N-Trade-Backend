const express = require('express');
const dotenv = require('dotenv');
const { connectToDatabase } = require('./database');
const cors = require('cors')

dotenv.config();

const app = express();
// CORS
app.use(cors())

// Middleware
app.use(express.json());

// Connect to MongoDB
connectToDatabase().then(db => {
    app.locals.db = db;  // Make db accessible in the app
    console.log('Connected to MongoDB');
}).catch(err => {
    console.error('Failed to connect to MongoDB', err);
});

// Routes
const userRouter = require('./routes/userRoutes');
const listingRouter = require('./routes/listingRoutes');

app.use('/api/user', userRouter);
app.use('/api/listing', listingRouter);

module.exports = app;
