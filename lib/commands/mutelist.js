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
      }]
    });
  }

  exec (message, args) {
    var reply = '';
    for (var id of args.channel.permissionOverwrites.filter(g => g.type === 'member').map(g => g.id)) {
      if (!message.guild.member(id).permissionsIn(args.channel).has('SEND_MESSAGES')) {
        reply += message.guild.member(id) + '\n';
      }
    }
    var embed = this.client.util.embed()
      .addField(`Muted in #${args.channel.name}`, reply !== '' ? reply : 'No users');
    return message.channel.send(embed);
  }
}

module.exports = MutelistCommand;
