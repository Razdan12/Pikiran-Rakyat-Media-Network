const jwt = require('jsonwebtoken');
const dotenv = require("dotenv");

dotenv.config();

const secretKey = process.env.SECRET_KEY_JWT;

const AuthSDAdmin = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    res.status(401).json({ error: 'Missing authorization header' });
    return;
  }
  const token = authHeader.split(' ')[1];
  try {
    const decodedToken = jwt.verify(token, secretKey);
    req.user = decodedToken;
    // Check if the token has expired
    const current_time = Date.now().valueOf() / 1000;
    if (decodedToken.exp < current_time) {
      res.status(401).json({ error: 'Token expired' });
      return;
    }
    if (req.user.role !== 'admin' ) {
      res.status(401).json({ error: 'Invalid role admin' });
      return;
    }
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

const AuthAll = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    res.status(401).json({ error: 'Missing authorization header' });
    return;
  }
  
  const token = authHeader.split(' ')[1];
  try {
    const decodedToken = jwt.verify(token, secretKey);
    req.user = decodedToken;
    // Check if the token has expired
    const current_time = Date.now().valueOf() / 1000;
    if (decodedToken.exp < current_time) {
      res.status(401).json({ error: 'Token expired' });
      return;
    }
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

module.exports = {AuthSDAdmin, AuthAll};
