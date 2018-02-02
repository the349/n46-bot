const { Command } = require('discord-akairo');
const logger = require('../../logger');

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

  async exec (message, args) {
    // Manually check if the banner could ban the user themself
    // Block the command if the user couldn't
    if (!message.member.hasPermission('BAN_MEMBERS') ||
        !message.member.highestRole.calculatedPosition > args.member.highestRole.calculatedPosition) {
      return this.client.commandHandler.emit('commandBlocked', message, this, 'userPermissions');
    }

    // Ban the user
    try {
      await args.member.ban(`User banned at the request of ${message.member.name}`);
      message.react('✅');
    } catch (error) {
      // Just it case that doesn't work (Discord just won't have it I guess)
      logger.log('banCommand', error);
      message.channel.send(this.client.util.embed()
        .setColor('#FF4136')
        .setAuthor(this.client.user.username, this.client.user.avatarURL)
        .addField('Command Failure', error.message));
    }
  }
}

module.exports = BanCommand;
