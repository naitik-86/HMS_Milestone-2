const jwt = require('jsonwebtoken');

// 1. Verify JWT and inject user data into the request
const protect = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ success: false, message: 'Not authorized, no token' });
  }

  try {
    // console.log("TOKEN RECEIVED:", token);
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // console.log("Decoded Token:", decoded);

    req.user = decoded; // Contains id, role, and clinicId
    next();
  } catch (err) {
    console.log("JWT ERROR:", err.message);
    console.log("JWT SECRET:", process.env.JWT_SECRET);
    res.status(401).json({ success: false, message: 'Token failed' });
  }
};

// 2. Role Setup: Ensure only specific roles can access endpoints[cite: 1, 2]
const authorize = (...roles) => {
  return (req, res, next) => {

    console.log("Allowed Roles:", roles);
    console.log("Current User:", req.user);
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Role ${req.user.role} is not authorized for this route`
      });
    }
    next();
  };
};

module.exports = { protect, authorize };