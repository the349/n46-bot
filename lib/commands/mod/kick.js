const { Command } = require('discord-akairo');

// Tested and works: 2018-02-21
// No edits since

class KickCommand extends Command {
  constructor () {
    super('kick', {
      aliases: ['kick'],
      clientPermissions: ['KICK_MEMBERS'],
      args: [{
        id: 'member',
        type: 'member'
      }, {
        id: 'reason',
        match: 'content'
      }]
    });
  }

  async exec (message, { reason, member }) {
    // Manually check if the kicker could kick the user themself
    // Block the command if the user couldn't
    if (!message.member.hasPermission('KICK_MEMBERS') ||
      !message.member.highestRole.calculatedPosition > member.highestRole.calculatedPosition) {
      return this.client.commandHandler.emit('commandBlocked', message, this, 'userPermissions');
    }

    reason = reason.split(' ').slice(1).join(' ');

    // Kick the user
    try {
      await member.kick(`User kicked at the request of ${message.member.user}\nReason: ${reason}`);
      message.react('✅');
    } catch (error) {
      // Just it case that doesn't work (Discord just won't have it I guess)
      this.client.logger.error(error, {module: 'kickCommand'});
      message.channel.send(this.client.util.embed()
        .setColor('#FF4136')
        .setAuthor(this.client.user.username, this.client.user.avatarURL)
        .addField('Command Failure', error.message));
    }
  }
}

module.exports = KickCommand;
