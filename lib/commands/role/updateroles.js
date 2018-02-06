const { Command } = require('discord-akairo');

class UpdateRolesCommand extends Command {
  constructor () {
    super('uproles', {
      aliases: ['updateroles', 'uproles'],
      userPermissions: ['MANAGE_ROLES']
    });
  }

  exec (message) {
    this.client.updateRoleGroups(message.guild);
    return message.react('✅');
  }
}

module.exports = UpdateRolesCommand;
