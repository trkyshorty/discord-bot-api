const express = require('express');
const axios = require('axios');
const auth = require('../middleware/auth');
const guildModel = require('../models/guild');

const router = express.Router();

router.get('/', auth, (req, res) => {
  res.send('respond guilds');
});

router.get('/:id', auth, async (req, res) => {
  /* const hasGuild = req.user.guilds.find((object) => object.id === req.params.id);

  if (!hasGuild) {
    return res.status(401).send({
      message: 'Unauthorized!',
    });
  }

  console.info(hasGuild);

  const hasPermission = hasGuild.permissions & 8; // eslint-disable-line no-bitwise

  if (!hasGuild.owner) {
    return res.status(401).send({
      message: 'Unauthorized!',
    });
  } */

  await axios
    .get(`${process.env.DISCORD_API_URL}/guilds/${req.params.id}`, {
      headers: {
        authorization: `Bot ${process.env.DISCORD_TOKEN}`,
      },
    })
    .then(async (response) => {
      const { data } = response;
      const guildData = await guildModel.findOneAndUpdate(
        {
          guild_id: data.id,
        },
        {
          guild_name: data.name,
        },
        {
          setDefaultsOnInsert: true,
          upsert: true,
          new: true,
        }
      );

      data.plugins = guildData.plugins;

      res.json(data);
    })
    .catch((error) => {
      res.status(400).send({
        message: error.message,
      });
    });
});

module.exports = router;
