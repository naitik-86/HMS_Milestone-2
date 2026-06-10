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
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Contains id, role, and clinicId
    next();
  } catch (err) {
    res.status(401).json({ success: false, message: 'Token failed' });
  }
};

// 2. Role Setup: Ensure only specific roles can access endpoints[cite: 1, 2]
const authorize = (...roles) => {
  return (req, res, next) => {
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