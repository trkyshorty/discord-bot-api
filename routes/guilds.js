const express = require('express');
const router = express.Router();

/* GET guilds listing. */
router.get('/', (req, res, next) => {
  res.send('respond guilds');
});

module.exports = router;
