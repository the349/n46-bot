const { Listener } = require('discord-akairo');

class JoinListener extends Listener {
  constructor () {
    super('commandCooldown', {
      eventName: 'commandCooldown',
      emmiter: 'commandHandler'
    });
  }

  exec (message) {
    this.client.reactSequence(message, ['🆒', '⬇']);
  }
}

module.exports = JoinListener;
