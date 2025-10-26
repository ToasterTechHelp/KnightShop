const express = require('express');
const app = express();
const port = process.env.PORT || 3001; // Use a different port than frontend default 3000

// Middleware to parse JSON request bodies
app.use(express.json());

// Basic health check route
app.get('/', (req, res) => {
  res.status(200).send('Backend is running');
});

// Route to receive error logs from the frontend
app.post('/api/log/error', (req, res) => {
  const errorData = req.body;
  console.error('Received error from frontend:', errorData); // Log the error data

  // In a real application, you might want to:
  // - Persist this error to a database (e.g., MongoDB, PostgreSQL)
  // - Send it to a dedicated error tracking service (e.g., Sentry, Bugsnag)
  // - Write it to a file
  // - Add more robust validation/sanitization for errorData

  res.status(200).send({ message: 'Error log received and processed' });
});

// Global error handler (optional, but good practice for API servers)
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err.stack);
  res.status(500).send('Something broke!');
});

app.listen(port, () => {
  console.log(`Backend server listening at http://localhost:${port}`);
});