const { Inhibitor } = require('discord-akairo');

class BlacklistInhibitor extends Inhibitor {
  constructor () {
    super('channelIgnore', {
      reason: 'channelIgnore'
    });
  }

  exec (message) {
    if (message.guild.config.ignore.channels.indexOf(message.channel.name) === -1) return false;
    const perms = message.guild.config.permissions.OVERRIDE_IGNORE.map((role) => {
      return message.member.roles.exists('name', role);
    });

    return perms.indexOf(true) === -1;
  }
}

module.exports = BlacklistInhibitor;
