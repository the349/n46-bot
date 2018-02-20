const { Listener } = require('discord-akairo');

class MessageDeleteListener extends Listener {
  constructor () {
    super('messageDeleteListener', {
      eventName: 'messageDelete',
      emitter: 'client'
    });
  }

  exec ({ guild, author, content, channel }) {
    if (!guild.config.history.on) return;
    return guild.channels.find('name', guild.config.history.logChannel)
      .send(this.client.util.embed()
        .setAuthor(`${author.username}#${author.discriminator}`, author.avatarURL)
        .setDescription(`**Message sent by ${author} deleted in ${channel}**
${content}`));
  }
}

module.exports = MessageDeleteListener;
