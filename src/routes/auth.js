const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');

const router = express.Router();

router.get('/', passport.authenticate('user'));

router.get('/callback', passport.authenticate('user', { failureRedirect: '/auth/error' }), (req, res) => {
  const token = jwt.sign(
    {
      user_id: req.session.passport.user.id,
    },
    process.env.API_SECRET,
    { expiresIn: '30d' }
  );
  res.redirect(`${process.env.FRONT_URL}/auth/callback?token=${token}`);
});

module.exports = router;
