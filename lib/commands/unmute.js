const { Command } = require('discord-akairo');

class UnmuteCommand extends Command {
  constructor () {
    super('unmute', {
      aliases: ['unmute'],
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
      var perms = channel.permissionOverwrites.get(member.id);
      if (perms && this.client.util.resolvePermissionNumber(perms.deny).includes('SEND_MESSAGES')) {
        if (perms.allow === 0 && (perms.deny === 2048 || perms.deny !== 2112)) {
          perms.delete();
        } else {
          channel.overwritePermissions(member, { 'SEND_MESSAGES': null, 'ADD_REACTIONS': null });
        }
        reply += channel.toString() + '\n';
      }
    });

    return message.channel.send(this.client.util.embed().addField(`${member.displayName} unmuted in`, reply || 'none'));
  }
}

module.exports = UnmuteCommand;
