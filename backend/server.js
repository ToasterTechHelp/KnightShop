const express = require('express');
const app = express();
const port = process.env.PORT || 3001; // Use 3001 for backend

// Middleware to parse JSON bodies
app.use(express.json());

// Basic health check route
app.get('/', (req, res) => {
  res.status(200).send('Backend service is running.');
});

// Endpoint for frontend or other services to log errors
app.post('/api/log/error', (req, res) => {
  const { message, stack, context = {} } = req.body;
  console.error(`[Client Error Log] - Message: ${message || 'No message provided'}`);
  if (stack) {
    console.error(`Stack: ${stack}`);
  }
  if (Object.keys(context).length > 0) {
    console.error('Context:', JSON.stringify(context, null, 2));
  }
  // Send a success response so the client knows the log was received
  res.status(204).send(); // 204 No Content is appropriate for a successful log receipt
});

// Example route that might throw an error (for testing error handler)
app.get('/api/simulate-error', (req, res, next) => {
  try {
    throw new Error('This is a simulated backend error!');
  } catch (error) {
    next(error); // Pass error to the error handling middleware
  }
});

// Catch-all for undefined routes
app.use((req, res, next) => {
  const error = new Error(`Cannot find ${req.method} ${req.url}`);
  error.status = 404;
  next(error);
});

// Global error handling middleware
app.use((err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message || 'Internal Server Error';

  console.error(`[Global Backend Error] Status: ${status}, Message: ${message}`);
  console.error('Stack:', err.stack); // Always log stack trace on the server side

  // Send a generic error response to the client
  res.status(status).json({
    message: message,
    // In production, avoid sending stack traces to the client for security reasons
    // stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Backend server listening on port ${port}`);
});
