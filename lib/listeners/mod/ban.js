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
      type: 22 // MEMBER_BAN_ADD
    });

    log = log.entries.array()[0];

    const id = Object.keys(guild.history).length;

    guild.history[id] = {
      type: 'Ban',
      time: log.createdTimestamp,
      id: log.id,
      shortId: id,
      user: user.id,
      mod: log.executor.id,
      reason: log.reason,
      for: (log.executor.id === this.client.user.id ? log.reason.split('\n')[0].split(' ').slice(-1)[0] : null)
    };

    // Not a default property
    log.for = guild.history[id].for;

    guild.updateHistory();

    if (!guild.config.history.logOn) return guild.history;

    return guild.channels.find('name', guild.config.history.logChannel)
      .send(this.client.util.embed()
        .setAuthor(log.executor.username, log.executor.avatarURL)
        .addField('Ban', `${user} has been banned.`)
        .addField('Mod', `${log.executor} executed the ban${(log.for !== null) ? `, for ${log.for}` : ''}`)
        .addField('Reason', `${log.reason}`)
        .setFooter(`id: ${id}`));
  }
}

module.exports = BanListener;
