const { Listener } = require('discord-akairo');

class BanListener extends Listener {
  constructor () {
    super('greetingBan', {
      eventName: 'guildBanAdd',
      emmiter: 'client'
    });
  }

  exec (guild, member) {
    if (!guild.config.greeting.on) return;

    // Make an red embed showing the banned user as the author
    const banEmbed = this.client.util.embed()
      .setAuthor(member.username, member.avatarURL)
      .setColor('#FF4136')
      .addField('User Has Been Banned', 'It was about time.');

    // Send out the embed out into the unforgiving world
    guild.channels.find('name', member.guild.config.greeting.greetChannel)
      .send(banEmbed);

    if (member.guild.config.greeting.greeterTalkChannel) {
      guild.channels.find('name', member.guild.config.greeting.greeterTalkChannel)
        .send(banEmbed);
    }
  }
}

module.exports = BanListener;
