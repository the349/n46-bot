const { Command } = require('../../bot');

// Tested and works: 2018-02-21
// No edits since

class MuteCommand extends Command {
  constructor () {
    super('mute', {
      aliases: ['mute'],
      clientPermissions: ['MANAGE_ROLES'],
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
        id: 'memberID',
        type: 'string'
      }, {
        id: 'milliseconds',
        match: 'prefix',
        type: 'integer',
        prefix: '-ms',
        default: 0
      }, {
        id: 'seconds',
        match: 'prefix',
        type: 'integer',
        prefix: '-s',
        default: 0
      }, {
        id: 'minutes',
        match: 'prefix',
        type: 'integer',
        prefix: '-m',
        default: 0
      }, {
        id: 'hours',
        match: 'prefix',
        type: 'integer',
        prefix: '-h',
        default: 0
      }, {
        id: 'days',
        match: 'prefix',
        type: 'integer',
        prefix: '-d',
        default: 0
      }]
    });
  }

  async exec (message, { generals, server, scope, member, memberID, reason, milliseconds, seconds, minutes, hours, days }) {
    if (memberID && !memberID.startsWith('<')) {
      member = await message.guild.fetchMember(memberID);
    }

    if (message.member.highestRole.calculatedPosition <= member.highestRole.calculatedPosition) {
      return this.client.commandHandler.emit('commandBlocked', message, this, 'userPermissions');
    }

    const originalScope = scope;

    if (server) {
      scope = message.guild.channels.filter(g => g.type === 'text');
    } else if (generals) {
      scope = message.guild.config.mutegroups.generals.map((channel) => {
        return message.guild.channels.find('name', channel);
      });
    }

    scope.forEach(channel => {
      channel.overwritePermissions(member, { 'SEND_MESSAGES': false });
    });

    // Schedule unmute if applicable
    if ([milliseconds, seconds, minutes, hours, days]
      .reduce(function (a, b) { return a + b; }) > 0) {
      setTimeout(() => {
        this.client.addTimer('unmute', {
          generals,
          server,
          ids: {
            author: message.author.id,
            channel: message.channel.id,
            scope: originalScope[0].id,
            guild: message.guild.id,
            member: member.id
          }
        }, this.client.util.computeTime({ milliseconds, seconds, minutes, hours, days }));
      });
    }

    return message.channel.send(this.client.util.embed()
      .setColor('#2ECC40')
      .setAuthor(message.author.username, message.author.avatarURL)
      .setDescription(`${member.displayName} muted`));
  }
}

module.exports = MuteCommand;
