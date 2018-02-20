const { Listener } = require('discord-akairo');

class MessageUpdateListener extends Listener {
  constructor () {
    super('messageUpdateListener', {
      eventName: 'messageUpdate',
      emitter: 'client'
    });
  }

  exec ({ guild, author, content, channel }, newMessage) {
    if (!guild.config.history.on) return;
    if (!newMessage.content) return;

    const id = Object.keys(guild.history).length;

    guild.history[id] = {
      type: 'Update',
      time: new Date().getTime(),
      id: id,
      shortId: id,
      user: author.id,
      mod: null,
      reason: null,
      content: [content, newMessage]
    };

    guild.updateHistory();

    if (!guild.config.history.logOn) return guild.history;
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
