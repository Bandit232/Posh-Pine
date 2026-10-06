require('dotenv').config();
const connectDB = require('./config/db');
const User = require('./models/User');

(async () => {
  try {
    await connectDB();
    const user = await User.findOne({ email: 'admin@example.com' }).lean();
    if (!user) {
      console.log('No admin user found');
      process.exit(0);
    }
    console.log('Admin user record:');
    console.log({
      _id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
      hasPassword: !!user.password,
    });
    process.exit(0);
  } catch (err) {
    console.error('Error checking admin user:', err);
    process.exit(1);
  }
})();
