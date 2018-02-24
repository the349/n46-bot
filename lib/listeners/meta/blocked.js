const { Listener } = require('discord-akairo');

class CommandBlockedListener extends Listener {
  constructor () {
    super('commandBlocked', {
      emitter: 'commandHandler',
      eventName: 'commandBlocked'
    });
  }

  exec (message, command, reason) {
    this.client.logger.info(`Blocked for ${reason}`, {module: command.id + 'Command'});
  }
}

module.exports = CommandBlockedListener;
