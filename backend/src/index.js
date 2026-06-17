require('dotenv').config({ path: require('path').resolve(__dirname, '..', '.env') });
const apiRoutes = require("./routes/index")

const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
// Import Main API Router
// const apiRoutes = require('./routes/api');
// const apiv2Routes = require('./routes/api_v2')

// Initialize Express App
const app = express();

const startCronJobs = require('./services/cronService');
// Connect to MongoDB
connectDB();

startCronJobs();

// Global Middlewares
// Global Middlewares
app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);

    if (
      /^http:\/\/localhost:\d+$/.test(origin) ||
      /^http:\/\/127\.0\.0\.1:\d+$/.test(origin)
    ) {
      return callback(null, true);
    }

    if (
      origin === process.env.FRONTEND_URL ||
      /\.vercel\.app$/.test(new URL(origin).hostname)
    ) {
      return callback(null, true);
    }

    return callback(new Error("Not allowed by CORS"));
  },
  credentials: true
})); // Allow requests from React Web and React Native Mobile
app.use(express.json()); // Parse incoming JSON payloads
app.use(express.urlencoded({ extended: true }));

// Mount Routes

app.use('/api/v1', apiRoutes); // single address for all api -> inside apiRoutes we will match the respective routes and connect further to its own respective routes file


// Health Check Route (Useful for AWS/Deployment checks)
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'Platform is online and running.' });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
});

// Start the Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
}); 