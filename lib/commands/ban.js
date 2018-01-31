const { Command } = require('discord-akairo');
const logger = require('../logger');

class BanCommand extends Command {
  constructor () {
    super('ban', {
      aliases: ['ban'],
      clientPermissions: ['BAN_MEMBERS'],
      args: [{
        id: 'member',
        type: 'member'
      }]
    });
  }

  exec (message, args) {
    if (!message.member.hasPermission('BAN_MEMBERS') ||
        !message.member.highestRole.calculatedPosition > args.member.highestRole.calculatedPosition) {
      return this.client.commandHandler.emit('commandBlocked', message, this, 'userPermissions');
    }
    return args.member.ban(`User banned at the request of ${message.member.name}`).catch((error) => {
      message.channel.send(this.client.util.embed()
        .setColor('#FF4136')
        .setAuthor(this.client.user.username, this.client.user.avatarURL)
        .addField('Command Failure', error.message));
      logger.log('banCommand', error);
    });
  }
}

module.exports = BanCommand;
