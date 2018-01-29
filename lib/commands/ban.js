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
      message.channel.send(this.client.util.embed()
        .setColor('#FF4136')
        .setAuthor(this.client.user.username, this.client.user.avatarURL)
        .addField('Command Failure', error.message));
      logger.log('banCommand', error);
    });
  }
}

module.exports = BanCommand;
