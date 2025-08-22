// seedAdmin.js
require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const bcrypt = require('bcryptjs');

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);

  const existingAdmin = await User.findOne({ username: 'admin' });
  if (existingAdmin) {
    console.log('Admin user already exists');
    process.exit();
  }

  const hash = await bcrypt.hash('12345', 10);
  await User.create({ username: 'admin', password: hash, role: 'Admin', base: '' });
  console.log('Admin user created');
  process.exit();
}
seed();
