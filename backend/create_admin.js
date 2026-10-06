require('dotenv').config();
// Uses MONGO_URI and JWT_SECRET from backend/.env (or environment)
process.env.NODE_ENV = process.env.NODE_ENV || 'development';
const connectDB = require('./config/db');
const User = require('./models/User');
(async () => {
  await connectDB();
  let user = await User.findOne({ email: 'admin@example.com' });
  if (user) {
    user.role = 'admin';
    user.name = 'Admin User';
    user.username = user.username || 'admin';
    await user.save();
    console.log('updated admin user', user.email);
  } else {
    user = await User.create({
      name: 'Admin User',
      username: 'Admin',
      email: 'admin@example.com',
      password: 'AdminPassword1!',
      role: 'admin',
    });
    console.log('created admin user', user.email);
  }
  process.exit(0);
})();
