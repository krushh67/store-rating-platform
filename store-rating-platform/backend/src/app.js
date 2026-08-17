const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const errorHandler = require('./middleware/errorMiddleware');

const app = express();

app.use(helmet());
app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:5173', credentials: true }));
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/stores', require('./routes/storeRoutes'));
app.use('/api/store-owner', require('./routes/storeOwnerRoutes'));

app.get('/api/health', (req, res) => res.json({ success: true, message: 'Server is running' }));

app.use(errorHandler);

module.exports = app;
