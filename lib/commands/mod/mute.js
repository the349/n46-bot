const { Command } = require('../../bot');
const { unmute } = require('./unmute');

// Tested and works: 2018-02-21
// No edits since

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
      }, {
        id: 'reason',
        type: 'string',
        match: 'content'
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

  exec (message, { server, scope, member, reason, milliseconds, seconds, minutes, hours, days }) {
    if (message.member.highestRole.calculatedPosition <= member.highestRole.calculatedPosition) {
      return this.client.commandHandler.emit('commandBlocked', message, this, 'userPermissions');
    }

    // Parse the reason out of the message
    let removedServer = false;
    reason = reason.split(' ').reduce((text, chunk) => {
      if (!/<@\d+>/.test(chunk) && !/-\w+\d+/.test(chunk)) {
        if (!removedServer && server) {
          if (chunk !== 'server') {
            text.push(chunk);
          }
        } else {
          text.push(chunk);
        }
      }

      return text;
    }, []).join(' ');

    if (server) {
      scope = message.guild.channels.filter(g => g.type === 'text');
    }

    var reply = '';
    scope.forEach(channel => {
      channel.overwritePermissions(member, { 'SEND_MESSAGES': false });
      reply += channel.toString() + '\n';
    });

    // Schedule unmute if applicable
    if ([milliseconds, seconds, minutes, hours, days]
      .reduce(function (a, b) { return a + b; }) > 0) {
      setTimeout(() => {
        unmute(this.client, message, server, scope, member);
        this.client.emit('guildMuteRemove', message.guild, message.author, message.author, reason);
      }, this.client.util.computeTime({ milliseconds, seconds, minutes, hours, days }));
    }

    // Emit mute event
    this.client.emit('guildMuteAdd', message.guild, member, message.author, reason);

    return message.channel.send(this.client.util.embed()
      .setColor('#2ECC40')
      .setAuthor(message.author.username, message.author.avatarURL)
      .addField(`${member.displayName} muted in`, reply || 'none'));
  }
}

module.exports = MuteCommand;
