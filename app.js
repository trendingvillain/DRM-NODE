const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

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
app.use(bodyParser.json());

// Configure CORS
app.use(cors({
  origin:[ 'https://idyllic-sable-72aa77.netlify.app/','http://localhost:5173/'], // Allow requests from this origin
  methods: 'GET,POST,PUT,DELETE,OPTIONS', // Allowed methods
  allowedHeaders: 'Content-Type,Authorization' // Allowed headers
}));

// Use routes
app.use('/api/buyers', buyerRoutes);
app.use('/api/buyer-income', buyerIncomeRoutes);
app.use('/api/buyer-records', buyerRecordsRoutes);
app.use('/api/land-owners', landOwnerRoutes);
app.use('/api/land-owners-records', landOwnerRecordsRoutes);
app.use('/api/land-available', landAvailableRoutes);
app.use('/api/cutoff', cutoffController);
app.use('/api/varients', varientRoutes);

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
