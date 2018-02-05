const { Listener } = require('discord-akairo');

class LeaveListener extends Listener {
  constructor () {
    super('guildMemberRemove', {
      eventName: 'guildMemberRemove',
      emmiter: 'client'
    });
  }

  async exec (member) {
    if (!this.client.config.greeting.on) return;

    const leaveEmbed = this.client.util.embed()
      .setAuthor(member.displayName, member.user.avatarURL)
      .setColor('#FF851B')
      .addField('User Has Left', 'Press F to pay respects.');

    // Press F to pay respects!
    const f = '🇫';

    // Send the messages and react to them
    let sentMessage = await member.guild.channels
      .find('name', this.client.config.greeting.greetChannel)
      .send(leaveEmbed);
    sentMessage.react(f);

    if (!this.client.config.greeting.greeterTalkChannel) return;
    sentMessage = await member.guild.channels
      .find('name', this.client.config.greeting.greeterTalkChannel)
      .send(leaveEmbed);
    sentMessage.react(f);
  }
}

module.exports = LeaveListener;
