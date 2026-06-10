const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const User = require('./src/models/User');

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    
    let admin = await User.findOne({ role: 'SUPER_ADMIN' });
    if (!admin) {
      admin = await User.create({
        name: 'Super Admin',
        mobile: '9999999999',
        role: 'SUPER_ADMIN',
      });
      console.log('Created Super Admin:', admin);
    } else {
      console.log('Super Admin already exists:', admin);
    }

    const token = jwt.sign(
      { id: admin._id, role: admin.role, clinicId: admin.clinicId }, 
      process.env.JWT_SECRET, 
      { expiresIn: '1d' }
    );

    console.log('=================================');
    console.log('Super Admin Token (copy this):');
    console.log(token);
    console.log('=================================');
    console.log('You can set this in your browser console:');
    console.log(`localStorage.setItem('token', '${token}')`);
    console.log('=================================');
    
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

seed();