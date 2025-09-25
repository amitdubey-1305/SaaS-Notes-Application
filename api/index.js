require('dotenv').config();
const express = require('express');
const cors = require('cors');

// --- 1. Import all your routes first ---
const authRoutes = require('./routes/auth');
const notesRoutes = require('./routes/notes');
const tenantRoutes = require('./routes/tenants'); // <-- The new route

// --- 2. Initialize the Express App ---
const app = express();

// --- 3. Setup Middleware ---
app.use(cors());
app.use(express.json());

// --- 4. Use the Routes ---
app.use('/api/auth', authRoutes);
app.use('/api/notes', notesRoutes);
app.use('/api/tenants', tenantRoutes); // <-- Use the new route

// Health Check Endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// --- 5. Start the Server ---
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});