const asyncHandler = require("express-async-handler");
// const {secretKey} = require("../extras/generateToken");
const jwt = require("jsonwebtoken");
const User = require("../models/user")
// const Token = require("../models/token");


const protect = asyncHandler(async (req, res, next) => {
    let token;
  
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
      token = req.headers.authorization.split(" ")[1];
  
      try {
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        const tokenUser = await User.findById(decoded.userId);
  
        if (!tokenUser || decoded.userId !== tokenUser._id.toString()) {
          return res.status(401).json({
            message: "You are logged out",
          });
        }
  
        req.user = decoded;
        next();
      } catch (error) {
        console.error(error);
        res.status(400).json({ message: "Unauthorized" });
      }
    } else {
      res.status(404).json({ message: "No token provided." });
    }
  });
  
  

module.exports = protect;