const { Command } = require('discord-akairo');
const { log } = require('../../bot/logger');

class QuitCommand extends Command {
  constructor () {
    super('quit', {
      aliases: ['quit'],
      userPermissions: ['ADMINISTRATOR']
    });
  }

  exec (message) {
    this.client.db.close();
    log('core', 'Shutting down per request...');
    process.exit();
  }
}

module.exports = QuitCommand;
