const { Command } = require('../../bot');

// Tested and works: 2018-02-21
// No edits since

class UnmuteCommand extends Command {
  constructor () {
    super('unmute', {
      aliases: ['unmute'],
      clientPermissions: ['MANAGE_ROLES'],
      userPermissions: ['MANAGE_MESSAGES', 'MANAGE_ROLES'],
      botPermissions: ['MUTE_USER'],
      args: [{
        id: 'server',
        match: 'flag',
        prefix: 'server'
      }, {
        id: 'generals',
        match: 'flag',
        prefix: 'generals'
      }, {
        id: 'scope',
        type: 'channels',
        match: 'content',
        default: msg => [msg.channel]
      }, {
        id: 'member',
        type: 'member',
        match: 'content'
      }, {
        id: 'milliseconds',
        match: 'prefix',
        type: 'integer',
        prefix: 'ms',
        default: 0
      }, {
        id: 'seconds',
        match: 'prefix',
        type: 'integer',
        prefix: 's',
        default: 0
      }, {
        id: 'minutes',
        match: 'prefix',
        type: 'integer',
        prefix: 'm',
        default: 0
      }, {
        id: 'hours',
        match: 'prefix',
        type: 'integer',
        prefix: 'h',
        default: 0
      }, {
        id: 'days',
        match: 'prefix',
        type: 'integer',
        prefix: 'd',
        default: 0
      }]
    });
  }

  static unmute (client, message, server, generals, scope, member) {
    if (server) {
      scope = message.guild.channels.filter(g => g.type === 'text');
    } else if (generals) {
      scope = message.guild.config.mutegroups.generals.map((channel) => {
        return message.guild.channels.find('name', channel);
      });
    }

    scope.forEach(channel => {
      var perms = channel.permissionOverwrites.get(member.id);
      if (perms && client.util.resolvePermissionNumber(perms.deny).includes('SEND_MESSAGES')) {
        if (perms.allow === 0 && (perms.deny === 2048 || perms.deny !== 2112)) {
          perms.delete();
        } else {
          channel.overwritePermissions(member, { 'SEND_MESSAGES': null, 'ADD_REACTIONS': null });
        }
      }
    });

    return message.channel.send(client.util.embed()
      .setColor('#2ECC40')
      .setAuthor(message.author.username, message.author.avatarURL)
      .setDescription(`${member.displayName} unmuted`));
  }

  exec (message, { server, generals, scope, member, milliseconds, seconds, minutes, hours, days }) {
    if (message.member.highestRole.calculatedPosition <= member.highestRole.calculatedPosition) {
      return this.client.commandHandler.emit('commandBlocked', message, this, 'userPermissions');
    }

    // Get sum of times and see if any are used
    if ([milliseconds, seconds, minutes, hours, days]
      .reduce(function (a, b) { return a + b; }) === 0) {
      this.client.emit('guildMuteRemove', message.guild, message.author, message.author);
      return UnmuteCommand.unmute(this.client, message, server, generals, scope, member);
    }

    return setTimeout(() => {
      message.reply(` ${member}`);
      UnmuteCommand.unmute(this.client, message, server, generals, scope, member);
      this.client.emit('guildMuteRemove', message.guild, message.author, message.author);
    }, this.client.util.computeTime({ milliseconds, seconds, minutes, hours, days }));
  }
}

module.exports = UnmuteCommand;
