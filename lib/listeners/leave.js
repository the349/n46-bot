const { Listener } = require('discord-akairo');

class LeaveListener extends Listener {
  constructor () {
    super('guildMemberRemove', {
      eventName: 'guildMemberRemove',
      emmiter: 'client'
    });
  }

  exec (member) {
    const greeters = member.guild.channels.find('name', 'greeters');
    const intro = member.guild.channels.find('name', 'introduction');

    const leaveEmbed = this.client.util.embed()
      .setAuthor(member.displayName, member.user.avatarURL)
      .setColor('#FF851B')
      .addField('User Has Left', 'Press F to pay respects.');

    const f = '🇫';

    greeters.send(leaveEmbed).then((sentMessage) => {
      sentMessage.react(f);
    });

    intro.send(leaveEmbed).then((sentMessage) => {
      sentMessage.react(f);
    });
  }
}

module.exports = LeaveListener;
