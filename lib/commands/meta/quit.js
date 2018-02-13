const { Command } = require('discord-akairo');

class QuitCommand extends Command {
  constructor () {
    super('quit', {
      aliases: ['quit'],
      ownerOnly: true
    });
  }

  userPermissions (message) {
    const perms = message.guild.config.permissions.QUIT_BOT.map((role) => {
      return message.member.roles.exists('name', role);
    });
    return perms.indexOf(true) > -1;
  }

  exec (message) {
    this.client.db.close();
    this.client.logger.info('core', 'Shutting down per request...');
    process.exit();
  }
}

module.exports = QuitCommand;
