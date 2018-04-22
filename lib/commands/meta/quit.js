const { Command } = require('../../bot');

// Tested and works: 2018-02-21
// No edits since

class QuitCommand extends Command {
  constructor () {
    super('quit', {
      aliases: ['quit'],
      channelRestriction: 'guild',
      botPermissions: ['QUIT_BOT']
    });
  }

  exec (message) {
    this.client.db.close();
    this.client.logger.info('Shutting down per request...', {module: 'core'});
    process.exit();
  }
}

module.exports = QuitCommand;
