const Akairo = require('discord-akairo');
const logger = require('../logger');

class JoinListener extends Akairo.Listener {

  constructor() {
    super('guildMemberAdd', {
      eventName: 'guildMemberAdd',
      emmiter: 'client'
    });
  }

  exec(member) {
    const greeters = member.guild.channels.find('name', 'greeters');
    const intro = member.guild.channels.find('name', 'introduction');

    const greetersEmbed = this.client.util.embed()
      .setAuthor(member.displayName, member.user.avatarURL)
      .setThumbnail(member.user.avatarURL)
      .setColor('#2ECC40')
      .addField('Account Join', member.joinedAt.toGMTString())
      .addField('Account Creation', member.user.createdAt.toGMTString())

    const introEmbed = this.client.util.embed()
      .setColor('#2ECC40')
      .setThumbnail(member.user.avatarURL)
      .addField('Welcome to ' + member.guild.name, 'Please wait for a greeter to welcome you')

    greeters.send(greetersEmbed)
    intro.send(member)
    intro.send(introEmbed)
  }

}

module.exports = JoinListener
