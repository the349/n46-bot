const { Command } = require('discord-akairo');
const logger = require('../logger');

class BanCommand extends Command {
  constructor () {
    super('ban', {
      aliases: ['ban'],
      clientPermissions: ['BAN_MEMBERS'],
      userPermissions: ['BAN_MEMBERS'],
      args: [{
        id: 'member',
        type: 'member'
      }]
    });
  }

  exec (message, args) {
    args.member.ban().catch((error) => {
      message.reply(`I cannot ban this user because: ${error.message}`);
      logger.error('banCommand', error);
    });
  }
}

module.exports = BanCommand;
