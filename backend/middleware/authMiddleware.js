const jwt = require("jsonwebtoken");
const User = require("../models/User");

const protect = async (req, res, next) => {
  let token;

  try {
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      const user = await User.findById(decoded.id).select("-password");

      if (!user) {
        return res.status(401).json({
          success: false,
          message: "Your account could not be found. Please log in again.",
        });
      }

      req.user = user;
      return next();
    }

    return res.status(401).json({
      success: false,
      message:
        "Please log in to use the AI Assistant. Sign in to continue chatting and analyzing images.",
    });
  } catch (error) {
    console.error("Authentication Error:", error.message);

    return res.status(401).json({
      success: false,
      message:
        "Your session has expired or is invalid. Please log in again to continue using the AI Assistant.",
    });
  }
};

module.exports = protect;
module.exports.default = protect;
