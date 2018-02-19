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

    if (!guild.history.hasOwnProperty('bans')) guild.history.bans = {};

    const id = `b${Object.keys(guild.history.bans).length.toString(32)}`;

    guild.history.bans[id] = {
      time: log.createdTimestamp,
      id: log.id,
      shortId: log.time,
      type: 'ban',
      user: user.id,
      mod: log.executor.id,
      reason: log.reason
    };

    guild.updateHistory();

    if (!guild.config.history.logOn) return guild.history;

    guild.channels.find('name', guild.config.history.logChannel)
      .send(this.client.util.embed()
        .setColor('#FF4136')
        .addField('Ban', `${user.username} has been banned.`)
        .addField('Mod', `${log.executor.username} executed the ban.`)
        .addField('Reason', `${log.reason}`)
        .setFooter(`ACTION ID: ${id}`));
  }
}

module.exports = BanListener;
