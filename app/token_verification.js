const { verify } = require('jsonwebtoken');
require('dotenv').config();

module.exports.checkToken = (req, res, next) => {
  let token = req.get('authorization');
  if (token) {
    token = token.slice(7);
    verify(token, process.env.JWT_SECRET, (error, results) => {
      if (error) {
        res.json({
          success: 0,
          message: 'Invalid Token',
        });
      } else {
        if (results.user) {
          req.type = results.user.type
        }
        next();
      }
    });
  } else {
    res.json({
      success: 0,
      message: 'Access Denied, Unauthorized user',
    });
  }
};
