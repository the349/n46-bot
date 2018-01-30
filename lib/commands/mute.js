const { Command } = require('discord-akairo');

class MuteCommand extends Command {
  constructor () {
    super('mute', {
      aliases: ['mute'],
      clientPermissions: ['MANAGE_ROLES'],
      userPermissions: ['MANAGE_MESSAGES'],
      args: [{
        id: 'server',
        match: 'flag',
        prefix: 'server'
      }, {
        id: 'channels',
        type: 'channels',
        match: 'content',
        default: msg => [msg.channel]
      }, {
        id: 'member',
        type: 'member',
        match: 'content'
      }]
    });
  }

  exec (message, { server, channels, member }) {
    if (message.member.highestRole.calculatedPosition <= member.highestRole.calculatedPosition) {
      return this.client.commandHandler.emit('commandBlocked', message, this, 'userPermissions');
    }
  }
}

module.exports = MuteCommand;
