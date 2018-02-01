const { Listener } = require('discord-akairo');

class BanListener extends Listener {
  constructor () {
    super('guildBanAdd', {
      eventName: 'guildBanAdd',
      emmiter: 'client'
    });
  }

  exec (guild, member) {
    // Make an red embed showing the banned user as the author
    const banEmbed = this.client.util.embed()
      .setAuthor(member.username, member.avatarURL)
      .setColor('#FF4136')
      .addField('User Has Been Banned', 'It was about time.');

    // Send out the embed out into the unforgiving world
    guild.channels.find('name', 'greeters').send(banEmbed);
    guild.channels.find('name', 'introduction').send(banEmbed);
  }
}

module.exports = BanListener;
