const express = require('express');
const morgan = require('morgan');
const app = express();
const port = process.env.PORT || 3001; // Use environment variable for port

// Middleware to parse JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configure morgan for access logging
// Skip logging successful POST requests to /api/log/error to prevent false-positive alerts
app.use(morgan('dev', {
  skip: function (req, res) {
    return req.originalUrl === '/api/log/error' && res.statusCode < 300;
  }
}));

// Example route - merge your existing routes into this structure.
app.get('/', (req, res) => {
  res.status(200).send('KnightShop backend is running!');
});

// Endpoint for client-side error logging
app.post('/api/log/error', (req, res) => {
  // Log the client-side error. Using console.log instead of console.error
  // to avoid generating 'error' keyword in server logs for client-side reports.
  console.log('Client-side error report received:', req.body);
  res.status(200).send('Client error logged successfully.');
});

// Generic error handling middleware (optional but recommended for Express apps)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// Start the server
app.listen(port, () => {
  console.log(`KnightShop backend listening on port ${port}`);
});
