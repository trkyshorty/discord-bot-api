const express = require('express');
const axios = require('axios');
const auth = require('../middleware/auth');
const userModel = require('../models/user');
const guildModel = require('../models/guild');

const router = express.Router();

router.get('/me', auth, async (req, res) => {
  await axios
    .get(`${process.env.DISCORD_API_URL}/users/@me`, {
      headers: {
        authorization: `Bearer ${req.user.access_token}`,
      },
    })
    .then(async (response) => {
      const { data } = response;
      if (data.username !== req.user.user_name || data.email !== req.user.user_email) {
        await userModel.findOneAndUpdate(
          {
            user_id: data.id,
          },
          {
            user_name: data.username,
            user_email: data.email,
          },
          {
            setDefaultsOnInsert: true,
            upsert: true,
            new: true,
          }
        );
      }

      res.json(data);
    })
    .catch((error) => {
      res.status(400).send({
        message: error.message,
      });
    });
});

router.get('/me/guilds', auth, async (req, res) => {
  await axios
    .get(`${process.env.DISCORD_API_URL}/users/@me/guilds`, {
      headers: {
        authorization: `Bearer ${req.user.access_token}`,
      },
    })
    .then(async (response) => {
      const { data } = response;
      if (data.length !== req.user.guilds.length) {
        await userModel.findOneAndUpdate(
          {
            user_id: req.user.user_id,
          },
          {
            guilds: data.guilds,
          },
          {
            setDefaultsOnInsert: true,
            upsert: true,
            new: true,
          }
        );
      }

      const guilds = [];
      data.forEach((guild) => {
        const guildData = guild;
        const hasPermission = guild.permissions & 8; // eslint-disable-line no-bitwise

        guildData.leaved_at = null;

        if (hasPermission) {
          guildData.bot_master = true;
        } else {
          guildData.bot_master = false;
        }

        guildModel
          .findOne({
            guild_id: guildData.id,
          })
          .then((guildDoc) => {
            if (guildDoc) {
              guildData.leaved_at = guildDoc.leaved_at;
            }
          })
          .catch((err) => console.info(err));

        guilds.push(guildData);
      });

      res.json(guilds);
    })
    .catch((error) => {
      res.status(400).send({
        message: error.message,
      });
    });
});

module.exports = router;
