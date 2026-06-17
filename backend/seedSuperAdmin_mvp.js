/**
 * One-time MVP script to create a SuperAdmin user in MongoDB.
 *
 * Usage (run once):
 *   node seedSuperAdmin_mvp.js
 *
 * Required env vars in backend/.env:
 *   MONGO_URI
 *   JWT_SECRET
 *   SUPER_ADMIN_MOBILE (used by OTP flow)
 *
 * You can set the dummy credentials below OR via env vars:
 *   SUPER_ADMIN_EMAIL (optional)
 *   SUPER_ADMIN_PASSWORD (raw, optional)
 */

require('dotenv').config();

const bcrypt = require('bcryptjs');
const SuperAdmin = require('./src/models/SuperAdmin');
const connectDB = require('./src/config/db');

const DUMMY_EMAIL = process.env.SUPER_ADMIN_EMAIL || 'superadmin@example.com';
const DUMMY_PASSWORD_RAW = process.env.SUPER_ADMIN_PASSWORD || 'SuperAdmin@123';
const DUMMY_MOBILE = process.env.SUPER_ADMIN_MOBILE || '9999999999';

(async () => {
  await connectDB();

  const email = DUMMY_EMAIL.toLowerCase().trim();

  const existing = await SuperAdmin.findOne({ email });
  if (existing) {
    console.log('[seedSuperAdmin_mvp] SuperAdmin already exists:', existing.email);
    console.log('[seedSuperAdmin_mvp] Ensure backend/.env has SUPER_ADMIN_MOBILE=', DUMMY_MOBILE);
    process.exit(0);
  }

  const passwordHash = await bcrypt.hash(DUMMY_PASSWORD_RAW, 10);

  await SuperAdmin.create({
    email,
    password: passwordHash,
    role: 'SUPER_ADMIN',
  });

  console.log('[seedSuperAdmin_mvp] Created SuperAdmin:', email);
  console.log('[seedSuperAdmin_mvp] Dummy credentials (raw):');
  console.log('  email:', email);
  console.log('  password:', DUMMY_PASSWORD_RAW);
  console.log('  SUPER_ADMIN_MOBILE (OTP):', DUMMY_MOBILE);

  process.exit(0);
})().catch((e) => {
  console.error('[seedSuperAdmin_mvp] Failed:', e);
  process.exit(1);
});

