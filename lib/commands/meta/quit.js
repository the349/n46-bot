const { Command } = require('discord-akairo');

// Tested and works: 2018-02-21
// No edits since

class QuitCommand extends Command {
  constructor () {
    super('quit', {
      aliases: ['quit']
    });
  }

  userPermissions (message) {
    // Only allow people with QUIT_BOT permission to quit the bot
    const perms = message.guild.config.permissions.QUIT_BOT.map((role) => {
      return message.member.roles.exists('name', role);
    });
    return perms.indexOf(true) > -1;
  }

  exec (message) {
    this.client.db.close();
    this.client.logger.info('Shutting down per request...', {module: 'core'});
    process.exit();
  }
}

module.exports = QuitCommand;
