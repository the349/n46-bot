const { Command } = require('discord-akairo');

class MuteCommand extends Command {
  constructor () {
    super('mute', {
      aliases: ['mute'],
      clientPermissions: ['MANAGE_ROLES'],
      userPermissions: ['MANAGE_MESSAGES', 'MANAGE_ROLES'],
      args: [{
        id: 'server',
        match: 'flag',
        prefix: 'server'
      }, {
        id: 'scope',
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

  exec (message, { server, scope, member }) {
    if (message.member.highestRole.calculatedPosition <= member.highestRole.calculatedPosition) {
      return this.client.commandHandler.emit('commandBlocked', message, this, 'userPermissions');
    }
    if (server) {
      scope = message.guild.channels.filter(g => g.type === 'text');
    }
    var reply = '';
    scope.forEach(channel => {
      channel.overwritePermissions(member, { 'SEND_MESSAGES': false });
      reply += channel.toString() + '\n';
    });
    return message.channel.send(this.client.util.embed().addField(`${member.displayName} muted in`, reply || 'none'));
  }
}

module.exports = MuteCommand;
