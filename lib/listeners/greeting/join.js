const { Listener } = require('discord-akairo');

class JoinListener extends Listener {
  constructor () {
    super('greetingJoin', {
      eventName: 'guildMemberAdd',
      emmiter: 'client'
    });
  }

  isNewUser (joinedAt, createdAt) {
    const diff = joinedAt.getTime() - createdAt.getTime();

    if (diff < 604800000) {
      return true;
    }
    return false;
  }

  exec (member) {
    if (!member.guild.config.greeting.on) return;

    // Save this for later
    const intro = member.guild.channels
      .find('name', member.guild.config.greeting.greetChannel);

    // Provide others only what they need to know
    const introEmbed = this.client.util.embed()
      .setColor('#2ECC40')
      .setThumbnail(member.user.avatarURL)
      .addField(`Welcome to ${member.guild.name}`, member.guild.config.greeting.greetMessage);

    // Send the messages
    intro.send(introEmbed);
    if (!member.guild.config.greeting.greeterTalkChannel) return;

    const greeters = member.guild.channels
      .find('name', member.guild.config.greeting.greeterTalkChannel);

    // Provide greeters with info about the user
    const greetersEmbed = this.client.util.embed()
      .setAuthor(member.displayName, member.user.avatarURL)
      .setThumbnail(member.user.avatarURL)
      .setColor('#2ECC40')
      .addField('Account Join', member.joinedAt.toGMTString())
      .addField('Account Creation', member.user.createdAt.toGMTString());

    greeters.send(greetersEmbed);

    // Alert greeters of newly created accounts
    if (this.isNewUser(member.joinedAt, member.user.createdAt)) {
      greeters.send(this.client.util.embed()
        .setColor('#FF4136')
        .addField('This Account Is New', 'Their account was created within the last 48 hours.\nBe wary, but still be respectful!'));
    }
  }
}

module.exports = JoinListener;
