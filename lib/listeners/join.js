const Akairo = require('discord-akairo');
const logger = require('../logger');

const newUser = function(joinedAt, createdAt) {
  const diff = joinedAt.getTime() - createdAt.getTime();

  if (diff < 172800000) {
    return true;
  }
  return false;

};

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
      .addField('Account Creation', member.user.createdAt.toGMTString());

    const introEmbed = this.client.util.embed()
      .setColor('#2ECC40')
      .setThumbnail(member.user.avatarURL)
      .addField('Welcome to ' + member.guild.name, 'Please wait for a greeter.');

    greeters.send(greetersEmbed);
    intro.send(introEmbed);

    if (newUser(member.joinedAt, member.user.createdAt)) {
      greeters.send(this.client.util.embed()
        .setColor('#FF4136')
        .addField('This User Is New', 'Their account was created within the last 48 hours.\nBe wary, but still be respectful!'));
    }
  }

}

module.exports = JoinListener;
