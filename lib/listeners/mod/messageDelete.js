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

    const id = Object.keys(guild.history).length;

    guild.history[id] = {
      type: 'Delete',
      time: new Date().getTime(),
      id: id,
      shortId: id,
      user: author.id,
      mod: null,
      reason: null,
      content: content
    };

    guild.updateHistory();

    if (!guild.config.history.logOn) return guild.history;
    return guild.channels.find('name', guild.config.history.logChannel)
      .send(this.client.util.embed()
        .setAuthor(`${author.username}#${author.discriminator}`, author.avatarURL)
        .setDescription(`**Message sent by ${author} deleted in ${channel}**
${content}`)
        .setFooter(`id: ${id}`));
  }
}

module.exports = MessageDeleteListener;
