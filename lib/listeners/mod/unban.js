const { Listener } = require('discord-akairo');

class UnbanListener extends Listener {
  constructor () {
    super('modUnban', {
      eventName: 'guildBanRemove',
      emmiter: 'client'
    });
  }

  async exec (guild, user) {
    if (!guild.config.history.on) return;

    let log = await guild.fetchAuditLogs({
      limit: 1,
      type: 23
    });

    log = log.entries.array()[0];

    const id = `u${Object.keys(guild.history).length}`;

    guild.history[id] = {
      type: 'Unban',
      time: log.createdTimestamp,
      id: log.id,
      shortId: id,
      user: user.id,
      mod: log.executor.id,
      reason: log.reason
    };

    guild.updateHistory();

    if (!guild.config.history.logOn) return guild.history;

    return guild.channels.find('name', guild.config.history.logChannel)
      .send(this.client.util.embed()
        .setAuthor(log.executor.username, log.executor.avatarURL)
        .addField('Unban', `${user} has been unbanned.`)
        .addField('Mod', `${log.executor} executed the unban.`)
        .setFooter(id));
  }
}

module.exports = UnbanListener;
