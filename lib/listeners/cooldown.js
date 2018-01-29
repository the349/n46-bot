const { Listener } = require('discord-akairo');

class CooldownListener extends Listener {
  constructor () {
    super('commandCooldown', {
      eventName: 'commandCooldown',
      emmiter: 'commandHandler'
    });
  }

  exec (message) {
    message.member.reply('Please wait a bit before using this command again').then((message) => {
      setTimeout(() => {
        message.delete();
      }, 10000);
    });
  }
}

module.exports = CooldownListener;
