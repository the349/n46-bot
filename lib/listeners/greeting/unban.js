const { Listener } = require('discord-akairo');

class BanListener extends Listener {
  constructor () {
    super('greetingUnban', {
      eventName: 'guildBanRemove',
      emmiter: 'client'
    });
  }

  exec (guild, member) {
    if (!guild.config.greeting.on) return;

    // Make an green embed showing the unbanned user as the author
    const unbanEmbed = this.client.util.embed()
      .setAuthor(member.username, member.avatarURL)
      .setColor('#2ECC40')
      .addField('User Has Been Unbanned', 'Ahh, the sweet taste of freedom.');

    // Send out the embed out into the unforgiving world
    guild.channels.find('name', member.guild.config.greeting.greetChannel)
      .send(unbanEmbed);

    if (member.guild.config.greeting.greeterTalkChannel) {
      guild.channels.find('name', member.guild.config.greeting.greeterTalkChannel)
        .send(unbanEmbed);
    }
  }
}

module.exports = BanListener;
