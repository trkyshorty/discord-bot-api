const express = require('express');
const path = require('path');
const logger = require('morgan');
const mongoose = require('mongoose');
const cors = require('cors');
const passport = require('passport');
const DiscordStrategy = require('passport-discord');

const authRouter = require('./routes/auth');
const usersRouter = require('./routes/users');
const guildsRouter = require('./routes/guilds');

const userModel = require('./models/user');

const app = express();

app.use(logger(process.env.NODE_ENV === 'development' ? 'dev' : 'combined'));

app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors({ origin: process.env.FRONT_URL }));

app.use(passport.initialize());

passport.use(
  'user',
  new DiscordStrategy.Strategy(
    {
      clientID: process.env.DISCORD_CLIENT_ID,
      clientSecret: process.env.DISCORD_CLIENT_SECRET,
      callbackURL: '/auth/callback',
      scope: ['identify', 'guilds'],
    },
    async (accessToken, refreshToken, profile, done) => {
      await userModel.findOneAndUpdate(
        {
          user_id: profile.id,
        },
        {
          user_id: profile.id,
          user_name: profile.username,
          user_email: profile.email,
          access_token: profile.accessToken,
          guilds: profile.guilds,
        },
        {
          setDefaultsOnInsert: true,
          upsert: true,
          new: true,
        }
      );

      return done(null, profile);
    }
  )
);

passport.serializeUser((u, d) => {
  d(null, u);
});

passport.deserializeUser((u, d) => {
  d(null, u);
});

mongoose
  .connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    app.use('/auth', authRouter);
    app.use('/users', usersRouter);
    app.use('/guilds', guildsRouter);
  });

module.exports = app;
