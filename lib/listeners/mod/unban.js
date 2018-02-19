const { Listener } = require('discord-akairo');

class zBanListener extends Listener {
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

    if (!guild.history.hasOwnProperty('unbans')) guild.history.unbans = {};

    const id = `ub${Object.keys(guild.history.unbans).length.toString(32)}`;

    guild.history.bans[id] = {
      type: 'Unban',
      time: log.createdTimestamp,
      id: log.id,
      shortId: log.time,
      user: user.id,
      mod: log.executor.id,
      reason: log.reason
    };

    guild.updateHistory();

    if (!guild.config.history.logOn) return guild.history;

    guild.channels.find('name', guild.config.history.logChannel)
      .send(this.client.util.embed()
        .setColor('#FF4136')
        .addField('Unban', `${user} has been unbanned.`)
        .addField('Mod', `${log.executor} executed the unban.`)
        .setFooter(`Action ID: ${id}`));
  }
}

module.exports = zBanListener;
