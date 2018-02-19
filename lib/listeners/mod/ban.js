const { Listener } = require('discord-akairo');

class BanListener extends Listener {
  constructor () {
    super('modBan', {
      eventName: 'guildBanAdd',
      emmiter: 'client'
    });
  }

  async exec (guild, user) {
    if (!guild.config.history.on) return;

    let log = await guild.fetchAuditLogs({
      limit: 1,
      type: 22
    });

    log = log.entries.array()[0];

    const id = `b${Object.keys(guild.history).length}`;

    guild.history[id] = {
      type: 'Ban',
      time: log.createdTimestamp,
      id: log.id,
      shortId: id,
      user: user.id,
      mod: log.executor.id,
      reason: log.reason,
      for: (log.executor.id === this.client.user.id ? log.reason.split(' ').slice(-1)[0] : null)
    };

    guild.updateHistory();

    if (!guild.config.history.logOn) return guild.history;

    return guild.channels.find('name', guild.config.history.logChannel)
      .send(this.client.util.embed()
        .setAuthor(log.executor.username, log.executor.avatarURL)
        .addField('Ban', `${user} has been banned.`)
        .addField('Mod', `${log.executor} executed the ban.`)
        .addField('Reason', `${log.reason}`)
        .setFooter(id));
  }
}

module.exports = BanListener;
