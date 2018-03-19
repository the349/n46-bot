const { Command } = require('../../bot');

// Tested and works: 2018-02-21
// No edits since

class MutelistCommand extends Command {
  constructor () {
    super('mutelist', {
      aliases: ['mutelist'],
      clientPermissions: ['MANAGE_ROLES'],
      userPermissions: ['MANAGE_ROLES'],
      botPermissions: ['MUTE_USER'],
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

  exec (message, { server, channels }) {
    if (server) {
      channels = message.guild.channels.filter(g => g.type === 'text');
    }

    var embed = this.client.util.embed()
      .setColor('#2ECC40')
      .setAuthor(message.author.username, message.author.avatarURL);

    channels.forEach(channel => {
      var reply = '';

      channel.permissionOverwrites.filter(g => g.type === 'member')
        .map(g => message.guild.member(g.id)).forEach(member => {
          if (!member.permissionsIn(channel).has('SEND_MESSAGES')) {
            reply += member + '\n';
          }
        });

      if (reply !== '') {
        embed.addField(`Muted in ${channel.name}`, reply);
      }
    });

    if (embed.fields.length === 0) {
      if (server) {
        embed.addField(`Muted on server`, 'No users');
      } else {
        channels.forEach(channel => {
          embed.addField(`Muted in ${channel.name}`, 'No users');
        });
      }
    }

    return message.channel.send(embed);
  }
}

module.exports = MutelistCommand;
