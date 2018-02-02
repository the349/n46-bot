const { Command } = require('discord-akairo');

class MFWCommand extends Command {
  constructor () {
    super('mfw', {
      aliases: ['mfw'],
      cooldown: 10000,
      ratelimit: 2
    });
  }

  exec (message, args) {
    return message.reply('😞 🇹 🇫 🇼 🇳 🇴 👩‍❤️‍👩');
  }
}

module.exports = MFWCommand;
