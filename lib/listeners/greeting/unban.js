const { Listener } = require('discord-akairo');

class BanListener extends Listener {
  constructor () {
    super('greetingUnban', {
      eventName: 'guildBanRemove',
      emmiter: 'client'
    });
  }

  exec (guild, user) {
    if (!guild.config.greeting.on) return;

    // Make an green embed showing the unbanned user as the author
    const unbanEmbed = this.client.util.embed()
      .setAuthor(user.username, user.avatarURL)
      .setColor('#2ECC40')
      .addField('User Has Been Unbanned', 'Ahh, the sweet taste of freedom.')
      .setFooter(`ID: ${user.id}`);

    // Send out the embed out into the unforgiving world
    if (guild.config.greeting.greeterTalkChannel) {
      guild.channels.find('name', guild.config.greeting.greeterTalkChannel)
        .send(unbanEmbed);
    }
  }
}

module.exports = BanListener;
