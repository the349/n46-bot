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
      .setColor('#FF851B');

    const bans = await member.guild.fetchBans();
    const isBanned = bans.has(member.user.id);

    if (!isBanned) {
      leaveEmbed.addField('User Has Left', 'Press F to pay respects.');
    } else {
      leaveEmbed.addField('User Has Left', 'They have been banned.');
    }

    // Press F to pay respects!
    const f = '🇫';

    // Send the message to the greet channel and react
    let sentMessage = await member.guild.channels
      .find('name', member.guild.config.greeting.greetChannel)
      .send(leaveEmbed);

    // Reset XP if applicable
    if (member.guild.config.xp.on) {
      const xp = this.client.db.get('xp');
      delete xp[`u${member.user.id}`];
      this.client.db.set('xp', xp);
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
