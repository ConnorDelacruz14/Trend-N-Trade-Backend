const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const app = express();

// Middleware
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

// Routes
const indexRouter = require('./routes/index');
app.use('/', indexRouter);

module.exports = app;