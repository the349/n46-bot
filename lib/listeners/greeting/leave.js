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
      .setTitle('User Has Left')
      .setFooter(`ID: ${member.id}`);

    const bans = await member.guild.fetchBans();
    const isBanned = bans.has(member.user.id);

    // Press F to pay respects!
    const f = '🇫';

    // Send the message to the greet channel and react
    let sentMessage = await member.guild.channels
      .find('name', member.guild.config.greeting.greetChannel)
      .send(leaveEmbed);

    if (member.guild.joins.has(member.id)) {
      member.guild.joins.delete(member.id);
    }

    // Send the message to the greeter channel if applicable
    if (!member.guild.config.greeting.greeterTalkChannel) return;
    sentMessage = await member.guild.channels
      .find('name', member.guild.config.greeting.greeterTalkChannel)
      .send(leaveEmbed);
    if (!isBanned) sentMessage.react(f);
  }
}

module.exports = LeaveListener;
