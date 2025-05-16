const express = require('express');
const serverless = require('serverless-http');
const cors = require('cors');
const queryRouter = require('../../src/routes/query');
const databaseRouter = require('../../src/routes/database');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/.netlify/functions/api/query', queryRouter);
app.use('/.netlify/functions/api/database', databaseRouter);

// Health check endpoint
app.get('/.netlify/functions/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Export the serverless function
exports.handler = serverless(app); 