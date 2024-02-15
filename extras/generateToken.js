const jwt = require("jsonwebtoken");

function generateAccessToken(userId) {
  const secretKey = process.env.ACCESS_TOKEN_SECRET;
  // Replace 'your-secret-key' with a strong and secret key used to sign the token

  // Replace the expiresIn value with the desired token expiration time (e.g., '1d' for 1 day)
  const expiresIn = process.env.ACCESS_TOKEN_EXPIRY;

  // Create the token
  const token = jwt.sign({ userId }, secretKey , {expiresIn} );

  return token;
}

function generateRefreshToken(userId){
  const expiresIn = process.env.REFRESH_TOKEN_EXPIRY;

  const token = jwt.sign({ userId }, process.env.REFRESH_TOKEN_SECRET , {expiresIn} );

  return token;
}

module.exports = {generateAccessToken, generateRefreshToken};