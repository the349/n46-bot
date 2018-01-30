const { Command } = require('discord-akairo');

class MutelistCommand extends Command {
  constructor () {
    super('mutelist', {
      aliases: ['mutelist'],
      clientPermissions: ['MANAGE_ROLES'],
      args: [{
        id: 'channel',
        type: 'channel',
        default: msg => msg.channel
      },
      {
        id: 'server',
        match: 'flag',
        prefix: 'server'
      }]
    });
  }

  exec (message, args) {
    var scope = [args.channel];
    if (args.server) {
      scope = message.guild.channels.filter(g => g.type === 'text');
    }
    var embed = this.client.util.embed();
    scope.forEach(channel => {
      var reply = '';
      for (var id of channel.permissionOverwrites.filter(g => g.type === 'member').map(g => g.id)) {
        if (!message.guild.member(id).permissionsIn(channel).has('SEND_MESSAGES')) {
          reply += message.guild.member(id) + '\n';
        }
      }
      if (reply !== '') {
        embed.addField(`Muted in #${channel.name}`, reply);
      }
    });
    if (embed.fields.length === 0) {
      if (args.server) {
        embed.addField(`Muted on server`, 'No users');
      } else {
        embed.addField(`Muted in #${args.channel.name}`, 'No users');
      }
    }
    return message.channel.send(embed);
  }
}

module.exports = MutelistCommand;
