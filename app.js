const express = require('express');
const cors = require('cors');
require('dotenv').config(); // Load environment variables

// Import routes
const buyerRoutes = require('./routes/buyerRoutes');
const buyerIncomeRoutes = require('./routes/buyerIncomeRoutes');
const buyerRecordsRoutes = require('./routes/buyerRecordsRoutes');
const landOwnerRoutes = require('./routes/landOwnerRoutes');
const landOwnerRecordsRoutes = require('./routes/landOwnerRecordsRoutes');
const landAvailableRoutes = require('./routes/landAvailableRoutes');
const varientRoutes = require('./routes/varientRoutes');
const cutoffController = require('./controllers/cutoffController');

const app = express();

// Middleware
app.use(express.json()); // Built-in body parser for JSON payloads

// Dynamic CORS Configuration
const allowedOrigins = [
  'http://localhost:3000', // Your backend
  'http://localhost:5173', // Your front-end (development)
  'https://pyytmg.csb.app', // Front-end on CodeSandbox
];

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('CORS not allowed for this origin'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true, // Enable cookies and authorization headers
}));

// Logging Middleware (Optional, for Debugging)
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} request to ${req.url}`);
  next();
});

// API Routes
app.use('/api/buyers', buyerRoutes);
app.use('/api/buyer-income', buyerIncomeRoutes);
app.use('/api/buyer-records', buyerRecordsRoutes);
app.use('/api/land-owners', landOwnerRoutes);
app.use('/api/land-owners-records', landOwnerRecordsRoutes);
app.use('/api/land-available', landAvailableRoutes);
app.use('/api/cutoff', cutoffController);
app.use('/api/varients', varientRoutes);

// Fallback Route for Undefined Routes
app.use((req, res, next) => {
  res.status(404).json({ message: 'Route not found' });
});

// Global Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(`Error: ${err.message}`);
  if (err.name === 'Error') {
    return res.status(403).json({ message: err.message });
  }
  res.status(500).json({ message: 'Internal Server Error' });
});

// Serve Static Files in Production
if (process.env.NODE_ENV === 'production') {
  const path = require('path');
  app.use(express.static(path.join(__dirname, 'build'))); // Serve front-end files

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'build', 'index.html'));
  });
}

// Start the Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
