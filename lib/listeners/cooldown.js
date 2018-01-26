const { Listener } = require('discord-akairo');

class JoinListener extends Listener {
  constructor () {
    super('commandCooldown', {
      eventName: 'commandCooldown',
      emmiter: 'commandHandler'
    });
  }

  exec (message) {
    message.react('🆒').then(() => { message.react('⬇'); });
  }
}

module.exports = JoinListener;
