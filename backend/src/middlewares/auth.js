const jwt = require("jsonwebtoken");

const protect = async (req, res, next) => {

  const authHeader =
    req.headers.authorization ||
    req.headers.Authorization;
  console.log("Authorization Header:", authHeader);

  const match =
    typeof authHeader === "string"
      ? authHeader.match(/^Bearer\s+(.+)$/i)
      : null;

  const token = match?.[1];
  console.log("Token:", token);

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
    console.log("Decoded:", decoded)

    req.user = decoded;

    next();

  } catch (err) {
    console.log("JWT Error:", err.message);
    return res.status(401).json({
      success: false,
      message: "Invalid token"
    });

  }

};

const authorize = (...roles) => {


  return (req, res, next) => {
    console.log("Authorize middleware");

    console.log("Headers:", req.headers.authorization);
    console.log("User:", req.user);
    console.log("Allowed Roles:", roles);

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