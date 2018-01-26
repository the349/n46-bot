const { Listener } = require('discord-akairo');

class BanListener extends Listener {
  constructor () {
    super('guildBanAdd', {
      eventName: 'guildBanAdd',
      emmiter: 'client'
    });
  }

  exec (guild, member) {
    const greeters = guild.channels.find('name', 'greeters');
    const intro = guild.channels.find('name', 'introduction');

    const banEmbed = this.client.util.embed()
      .setAuthor(member.username, member.avatarURL)
      .setColor('#FF4136')
      .addField('User Has Been Banned', 'It was about time.');

    greeters.send(banEmbed);
    intro.send(banEmbed);
  }
}

module.exports = BanListener;
