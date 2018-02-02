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

  async exec (message, args) {
    // Manually check if the kicker could kick the user themself
    // Block the command if the user couldn't
    if (!message.member.hasPermission('KICK_MEMBERS') ||
      !message.member.highestRole.calculatedPosition > args.member.highestRole.calculatedPosition) {
      return this.client.commandHandler.emit('commandBlocked', message, this, 'userPermissions');
    }

    // Kick the user
    try {
      await args.member.kick(`User kicked at the request of ${message.member.name}`);
    } catch (error) {
      // Just it case that doesn't work (Discord just won't have it I guess)
      logger.log('kickCommand', error);
      message.channel.send(this.client.util.embed()
        .setColor('#FF4136')
        .setAuthor(this.client.user.username, this.client.user.avatarURL)
        .addField('Command Failure', error.message));
    }
  }
}

module.exports = KickCommand;
