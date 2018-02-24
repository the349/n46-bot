const { Inhibitor } = require('discord-akairo');

class ChannenInhibitor extends Inhibitor {
  constructor () {
    super('channelIgnore', {
      reason: 'channelIgnore'
    });
  }

  exec (message) {
    return (message.guild.config.ignore.channels.indexOf(message.channel.name) > -1);
  }
}

module.exports = ChannenInhibitor;
