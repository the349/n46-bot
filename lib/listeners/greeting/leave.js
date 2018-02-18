const { Listener } = require('discord-akairo');

class LeaveListener extends Listener {
  constructor () {
    super('greetingLeave', {
      eventName: 'guildMemberRemove',
      emmiter: 'client'
    });
  }

  async exec (member) {
    if (!member.guild.config.greeting.on) return;

    const leaveEmbed = this.client.util.embed()
      .setAuthor(member.displayName, member.user.avatarURL)
      .setColor('#FF851B')
      .addField('User Has Left', 'Press F to pay respects.');

    // Press F to pay respects!
    const f = '🇫';

    // Send the message to the greet channel and react
    let sentMessage = await member.guild.channels
      .find('name', member.guild.config.greeting.greetChannel)
      .send(leaveEmbed);
    sentMessage.react(f);

    // Reset XP if applicable
    if (this.client.config.xp.on) {
      const xp = this.client.db.get('xp');
      delete xp[`u${member.user.id}`];
      this.client.db.set('xp', xp);
    }

    // Send the message to the greeter channel if applicable
    if (!member.guild.config.greeting.greeterTalkChannel) return;
    sentMessage = await member.guild.channels
      .find('name', member.guild.config.greeting.greeterTalkChannel)
      .send(leaveEmbed);
    sentMessage.react(f);
  }
}

module.exports = LeaveListener;
