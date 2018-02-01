const { Listener } = require('discord-akairo');

class LeaveListener extends Listener {
  constructor () {
    super('guildMemberRemove', {
      eventName: 'guildMemberRemove',
      emmiter: 'client'
    });
  }

  async exec (member) {
    const greeters = member.guild.channels.find('name', 'greeters');
    const intro = member.guild.channels.find('name', 'introduction');

    const leaveEmbed = this.client.util.embed()
      .setAuthor(member.displayName, member.user.avatarURL)
      .setColor('#FF851B')
      .addField('User Has Left', 'Press F to pay respects.');

    const f = '🇫';

    let sentMessage = await greeters.send(leaveEmbed);
    sentMessage.react(f);

    sentMessage = await intro.send(leaveEmbed);
    sentMessage.react(f);
  }
}

module.exports = LeaveListener;
