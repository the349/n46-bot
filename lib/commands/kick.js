const { Command } = require('discord-akairo');
const logger = require('../logger');

class KickCommand extends Command {
  constructor () {
    super('kick', {
      aliases: ['kick'],
      clientPermissions: ['KICK_MEMBERS'],
      args: [{
        id: 'member',
        type: 'member'
      }]
    });
  }

  exec (message, args) {
    if (!message.member.hasPermission('KICK_MEMBERS') ||
        !message.member.highestRole.calculatedPosition > args.member.highestRole.calculatedPosition) {
      return this.client.commandHandler.emit('commandBlocked', message, this, 'userPermissions');
    }
    return args.member.kick(`User kicked at the request of ${message.member.name}`).catch((error) => {
      message.channel.send(this.client.util.embed()
        .setColor('#FF4136')
        .setAuthor(this.client.user.username, this.client.user.avatarURL)
        .addField('Command Failure', error.message));
      logger.log('kickCommand', error);
    });
  }
}

module.exports = KickCommand;
