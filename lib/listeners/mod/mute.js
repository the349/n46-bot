const { Listener } = require('discord-akairo');

class MuteListener extends Listener {
  constructor () {
    super('modMute', {
      eventName: 'guildMuteAdd',
      emmiter: 'client'
    });
  }

  async exec (guild, user, mod, reason) {
    if (!guild.config.history.on) return;

    const id = Object.keys(guild.history).length;

    guild.history[id] = {
      type: 'Mute',
      time: new Date().getTime(),
      id: id,
      shortId: id,
      user: user.id,
      mod: mod.id,
      reason: reason
    };

    guild.updateHistory();

    if (!guild.config.history.logOn) return guild.history;

    return guild.channels.find('name', guild.config.history.logChannel)
      .send(this.client.util.embed()
        .setAuthor(mod.username, mod.avatarURL)
        .addField('Mute', `${user} has been muted.`)
        .addField('Mod', `${mod} executed the mute.`)
        .addField('Reason', reason)
        .setFooter(`id: ${id}`));
  }
}

module.exports = MuteListener;
