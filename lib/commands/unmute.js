const { Command } = require('discord-akairo');

class UnmuteCommand extends Command {
  constructor () {
    super('unmute', {
      aliases: ['unmute'],
      clientPermissions: ['MANAGE_ROLES'],
      args: [{
        id: 'member',
        type: 'member'
      }]
    });
  }

  exec (message, args) {
    // TODO remove permissionOverwrite if it only contains SEND_MESSAGES
  }
}

module.exports = UnmuteCommand;
