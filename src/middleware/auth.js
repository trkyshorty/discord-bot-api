const jwt = require('jsonwebtoken');
const userModel = require('../models/user');

const verifyToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return next('A token is required for authentication');
  }

  await jwt.verify(token, process.env.API_SECRET, async (err, decoded) => {
    if (err) {
      return next(err.message);
    }

    await userModel
      .findOne({ user_id: decoded.user_id })
      .populate('guild')
      .then((user) => {
        if (user === null) {
          return next('User not found');
        }

        req.user = user;
      });

    next();
  });
};

module.exports = verifyToken;
