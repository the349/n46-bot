const { Command } = require('discord-akairo');

// Tested and works: 2018-02-21
// No edits since

class UpdateCommand extends Command {
  constructor () {
    super('up', {
      aliases: ['update', 'up'],
      userPermissions: ['MANAGE_ROLES']
    });
  }

  exec (message) {
    message.guild.update();
    return message.react('✅');
  }
}

module.exports = UpdateCommand;
