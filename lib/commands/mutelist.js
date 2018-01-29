const { Command } = require('discord-akairo');

class MutelistCommand extends Command {
  constructor () {
    super('mutelist', {
      aliases: ['mutelist'],
      clientPermissions: ['MANAGE_ROLES']
    });
  }

  exec (message, args) {
    var reply = '';
    for (var id of message.channel.permissionOverwrites.filter(g => g.type === 'member').map(g => g.id)) {
      if (!message.guild.member(id).permissionsIn(message.channel).has('SEND_MESSAGES')) {
        reply += message.guild.member(id).displayName + '\n';
      }
    }
    return message.channel.send(this.client.util.embed()
      .addField('Muted in this channel', reply !== '' ? reply : 'No users'));
  }
}

module.exports = MutelistCommand;
