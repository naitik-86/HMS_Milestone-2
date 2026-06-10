const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Ensure you have MONGO_URI in your .env file
    const uri = process.env.MONGO_URI;
    if (!uri) {
      console.warn('MONGO_URI is not set. Server will start without DB connection.');
      return;
    }

    const conn = await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    // For local dev, don't crash the whole server if MongoDB is unreachable.
    // API endpoints depending on DB will still fail, but frontend can load.
  }
};

module.exports = connectDB;