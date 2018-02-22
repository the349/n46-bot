const { Listener } = require('discord-akairo');

class MessageUpdateListener extends Listener {
  constructor () {
    super('messageUpdateListener', {
      eventName: 'messageUpdate',
      emitter: 'client'
    });
  }

  exec ({ guild, author, content, channel }, newMessage) {
    // This event also fires when messages are deleted
    // We skip this in that situation and heandle it in messageDelete
    if (!guild.config.history.on || !guild.config.history.logOn || !content) return guild.history;
    return guild.channels.find('name', guild.config.history.logChannel)
      .send(this.client.util.embed()
        .setAuthor(`${author.username}#${author.discriminator}`, author.avatarURL)
        .setDescription(`**Message sent by ${author} edited in ${channel}**`)
        .addField('Before', content)
        .addField('After', newMessage.content)
      );
  }
}

module.exports = MessageUpdateListener;
