require('dotenv').config();
const connectDB = require('./config/db');

(async () => {
  try {
    console.log('Using MONGO_URI:', process.env.MONGO_URI ? '[REDACTED]' : 'not set');
    const conn = await connectDB();
    if (conn) console.log('MongoDB connection test: SUCCESS');
    else console.log('MongoDB connection test: SKIPPED (no URI)');
    process.exit(0);
  } catch (err) {
    console.error('MongoDB connection test: FAILED');
    console.error(err);
    process.exit(1);
  }
})();
