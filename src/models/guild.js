const mongoose = require('mongoose');

const guildSchema = mongoose.Schema(
  {
    guild_id: {
      type: String,
      required: true,
    },
    guild_name: {
      type: String,
      required: true,
    },
    leaved_at: {
      type: Date,
      default: null,
    },
    plugins: {
      welcome: {
        channel_message: {
          enable: { type: Boolean, default: false },
          channel: { type: Number, default: 0 },
          message: { type: String, default: '' },
        },
        direct_message: {
          enable: { type: Boolean, default: false },
          message: { type: String, default: '' },
        },
        assign_role: {
          enable: { type: Boolean, default: false },
          role: { type: Number, default: 0 },
        },
      },
    },
  },
  {
    timestamps: false,
  }
);

const Guild = mongoose.model('Guild', guildSchema);

module.exports = Guild;
