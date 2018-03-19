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
    intro.send(`${member}:`);
    intro.send(introEmbed);
    if (!member.guild.config.greeting.greeterTalkChannel) return;

    const greeters = member.guild.channels
      .find('name', member.guild.config.greeting.greeterTalkChannel);

    // Provide greeters with info about the user
    const greetersEmbed = this.client.util.embed()
      .setAuthor(member.user.tag, member.user.avatarURL)
      .setThumbnail(member.user.avatarURL)
      .setColor('#2ECC40')
      .setDescription(`${member}` + this.client.util.description({
        Join: this.client.util.timeString(member.joinedAt),
        Created: this.client.util.timeSinceString(member.user.createdAt),
        ID: member.id,
        Status: member.user.presence.status,
        Game: member.user.presence.game
      }));

    const sent = greeters.send(greetersEmbed);
    member.guild.joins.set(member.id, { sent: sent, embed: greetersEmbed });

    // Alert greeters of newly created accounts
    if (this.isNewUser(member.joinedAt, member.user.createdAt)) {
      greeters.send(this.client.util.embed()
        .setColor('#FF4136')
        .addField('This Account Is New', 'Their account was created within the last week.\nBe wary, but still be respectful!'));
    }
  }
}

module.exports = JoinListener;
