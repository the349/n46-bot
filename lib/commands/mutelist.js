const { Command } = require('discord-akairo');

class MutelistCommand extends Command {
  constructor () {
    super('mutelist', {
      aliases: ['mutelist'],
      clientPermissions: ['MANAGE_ROLES'],
      args: [{
        id: 'server',
        match: 'flag',
        prefix: 'server'
      }, {
        id: 'channels',
        type: 'channels',
        default: msg => [msg.channel]
      }]
    });
  }

  exec (message, args) {
    if (args.server) {
      args.channels = message.guild.channels.filter(g => g.type === 'text');
    }
    var embed = this.client.util.embed();
    args.channels.forEach(channel => {
      var reply = '';
      channel.permissionOverwrites.filter(g => g.type === 'member')
        .map(g => message.guild.member(g.id)).forEach(member => {
          if (!member.permissionsIn(channel).has('SEND_MESSAGES')) {
            reply += member + '\n';
          }
        });
      if (reply !== '') {
        embed.addField(`Muted in #${channel.name}`, reply);
      }
    });
    if (embed.fields.length === 0) {
      if (args.server) {
        embed.addField(`Muted on server`, 'No users');
      } else {
        args.channels.forEach(channel => {
          embed.addField(`Muted in #${channel.name}`, 'No users');
        });
      }
    }
    return message.channel.send(embed);
  }
}

module.exports = MutelistCommand;
