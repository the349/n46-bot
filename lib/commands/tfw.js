const { Command } = require('discord-akairo');

class TFWCommand extends Command {
  constructor () {
    super('tfw', {
      aliases: ['tfw'],
      cooldown: 10000,
      ratelimit: 2
    });
  }

  exec (message, args) {
    return message.reply('😞').then((message) => {
      message.react('🇹')
        .then(this.client.reactor(message, '🇫'))
        .then(this.client.reactor(message, '🇼'))
        .then(this.client.reactor(message, '🇼'))
        .then(this.client.reactor(message, '🇳'))
        .then(this.client.reactor(message, '🇴'))
        .then(this.client.reactor(message, '👨‍❤️‍👨'));
    });
  }
}

module.exports = TFWCommand;
