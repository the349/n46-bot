const { Listener } = require('discord-akairo');

class MessageDeleteListener extends Listener {
  constructor () {
    super('messageDeleteListener', {
      eventName: 'messageDelete',
      emitter: 'client'
    });
  }

  async exec ({ guild, author, content, channel }) {
    if (!guild.config.history.on) return;

    let log = await guild.fetchAuditLogs({
      limit: 1,
      type: 72
    });

    let id = null;

    const entry = log.entries.find((entry) => {
      if (entry.action !== 'MESSAGE_DELETE' && entry.target !== author) {
        return false;
      }

      // Make sure the event isn't already logged
      return Object.keys(guild.history).reduce((truth, history) => {
        truth = (truth && guild.history[history].id !== entry.id);
        return truth;
      }, true);
    });

    if (entry) {
      id = Object.keys(guild.history).length;

      guild.history[id] = {
        type: 'Delete',
        time: new Date().getTime(),
        id: entry.id,
        shortId: id,
        user: entry.id,
        mod: entry.executor.id,
        reason: null,
        content: content
      };

      guild.updateHistory();
    }

    if (!guild.config.history.logOn) return guild.history;
    return guild.channels.find('name', guild.config.history.logChannel)
      .send(this.client.util.embed()
        .setAuthor(`${author.username}#${author.discriminator}`)
        .setDescription(`**Message sent by ${author} deleted in ${channel}**\n${content}`)
        .setFooter(`id: ${(id || 'none')}`));
  }
}

module.exports = MessageDeleteListener;
