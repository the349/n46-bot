const { Command } = require('discord-akairo');
const { computeTime, unmute } = require('./unmute');

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

  exec (message, { server, scope, member, milliseconds, seconds, minutes, hours, days }) {
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

    // Schedule unmute if applicable
    if ([milliseconds, seconds, minutes, hours, days]
      .reduce(function (a, b) { return a + b; }) > 0) {
      setTimeout(() => {
        message.reply();
        unmute(this.client, message, server, scope, member);
      }, computeTime({ milliseconds, seconds, minutes, hours, days }));
    }

    return message.channel.send(this.client.util.embed()
      .setColor('#2ECC40')
      .setAuthor(message.author.username, message.author.avatarURL)
      .addField(`${member.displayName} muted in`, reply || 'none'));
  }
}

module.exports = MuteCommand;
