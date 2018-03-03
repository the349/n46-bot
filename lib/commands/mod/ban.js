const { Command } = require('../../bot');

// Tested and works: 2018-02-21
// No edits since

class BanCommand extends Command {
  constructor () {
    super('ban', {
      aliases: ['ban'],
      clientPermissions: ['BAN_MEMBERS'],
      args: [{
        id: 'member',
        type: 'member'
      }, {
        id: 'reason',
        match: 'content'
      }]
    });
  }

  async exec (message, { member, reason }) {
    // Manually check if the banner could ban the user themself
    // Block the command if the user couldn't
    if (!message.member.hasPermission('BAN_MEMBERS') ||
        !message.member.highestRole.calculatedPosition > member.highestRole.calculatedPosition) {
      return this.client.commandHandler.emit('commandBlocked', message, this, 'userPermissions');
    }

    reason = reason.split(' ').slice(1).join(' ');

    // Ban the user
    try {
      await member.ban(`User banned at the request of ${message.member.user}\nReason: ${reason}`);
      message.react('✅');
    } catch (error) {
      // Just it case that doesn't work (Discord just won't have it I guess)
      this.client.logger.error(error, {module: 'banCommand'});
      message.channel.send(this.client.util.embed()
        .setColor('#FF4136')
        .setAuthor(this.client.user.username, this.client.user.avatarURL)
        .addField('Command Failure', error.message));
    }
  }
}

module.exports = BanCommand;
