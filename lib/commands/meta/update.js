const { Command } = require('discord-akairo');

class UpdateCommand extends Command {
  constructor () {
    super('up', {
      aliases: ['update', 'up'],
      userPermissions: ['MANAGE_ROLES']
    });
  }

  exec (message) {
    this.client.updateGuild(message.guild);
    return message.react('✅');
  }
}

module.exports = UpdateCommand;
