const jwt = require('jsonwebtoken');

// 1. Verify JWT and inject user data into the request
const protect = async (req, res, next) => {
  const authHeader = req.headers.authorization || req.headers.Authorization;
  const match = typeof authHeader === 'string'
    ? authHeader.match(/^Bearer\s+(.+)$/i)
    : null;

  const token = match?.[1];


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
// const authorize = (...roles) => {
//   return (req, res, next) => {

//     if (!roles.includes(req.user.role)) {
//       return res.status(403).json({
//         success: false,
//         message: `Role ${req.user.role} is not authorized for this route`
//       });
//     }
//     next();
//   };
// };
const authorize = (...roles) => {
  return (req, res, next) => {

    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated"
      });
    }

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