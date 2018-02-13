const { Command } = require('discord-akairo');

class QuitCommand extends Command {
  constructor () {
    super('quit', {
      aliases: ['quit'],
      ownerOnly: true
    });
  }

  exec (message) {
    this.client.db.close();
    this.client.logger.info('core', 'Shutting down per request...');
    process.exit();
  }
}

module.exports = QuitCommand;
