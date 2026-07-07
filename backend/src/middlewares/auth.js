const jwt = require("jsonwebtoken");

const protect = async (req, res, next) => {

  const authHeader =
    req.headers.authorization ||
    req.headers.Authorization;

  const match =
    typeof authHeader === "string"
      ? authHeader.match(/^Bearer\s+(.+)$/i)
      : null;

  const token = match?.[1];

  if (!token) {

    return res.status(401).json({
      success: false,
      message: "Not authorized"
    });

  }

  try {

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    req.user = decoded;

    next();

  } catch (err) {

    return res.status(401).json({
      success: false,
      message: "Invalid token"
    });

  }

};

const authorize = (...roles) => {

  return (req, res, next) => {

    if (!roles.includes(req.user.role)) {

      return res.status(403).json({
        success: false,
        message: "Forbidden"
      });

    }

    next();

  };

};

module.exports = {
  protect,
  authorize
};