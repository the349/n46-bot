const { Command } = require('discord-akairo');

class QuitCommand extends Command {
  constructor () {
    super('quit', {
      aliases: ['quit']
    });
  }

  exec (message) {
    if (message.user.id !== this.client.ownerID) {
      this.client.commandHandler.emit('commandBlocked', message, this, 'userPermissions');
    }
    this.client.db.close();
    this.client.logger.info('core', 'Shutting down per request...');
    process.exit();
  }
}

module.exports = QuitCommand;
