const { Listener } = require('discord-akairo');

class LeaveListener extends Listener {
  constructor () {
    super('guildMemberRemove', {
      eventName: 'guildMemberRemove',
      emmiter: 'client'
    });
  }

  async exec (member) {
    const leaveEmbed = this.client.util.embed()
      .setAuthor(member.displayName, member.user.avatarURL)
      .setColor('#FF851B')
      .addField('User Has Left', 'Press F to pay respects.');

    // Press F to pay respects!
    const f = '🇫';

    // Send the messages and react to them
    let sentMessage = await member.guild.channels.find('name', 'greeters')
      .send(leaveEmbed);
    sentMessage.react(f);

    sentMessage = await member.guild.channels.find('name', 'introduction')
        .send(leaveEmbed);
    sentMessage.react(f);
  }
}

module.exports = LeaveListener;
