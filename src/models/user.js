const mongoose = require('mongoose');

const userSchema = mongoose.Schema(
  {
    user_id: {
      type: String,
      required: true,
    },
    user_name: {
      type: String,
      required: false,
    },
    user_email: {
      type: String,
      required: false,
    },
    access_token: {
      type: String,
      required: false,
    },
    guilds: [{ id: { type: String } }],
  },
  {
    timestamps: false,
  }
);

userSchema.virtual('guild', {
  ref: 'Guild',
  localField: 'guilds.id',
  foreignField: 'guild_id',
  // justOne: true,
});

userSchema.set('toObject', { virtuals: true });
userSchema.set('toJSON', { virtuals: true });

const User = mongoose.model('User', userSchema);

module.exports = User;
