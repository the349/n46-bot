const { Listener } = require('discord-akairo');

class CooldownListener extends Listener {
  constructor () {
    super('commandCooldown', {
      eventName: 'commandCooldown',
      emmiter: 'commandHandler'
    });
  }

  async exec (message) {
    message = await message.member.reply('Please wait a bit before using this command again');
    setTimeout(message.delete, 10000);
  }
}

module.exports = CooldownListener;
