const { Command } = require('discord-akairo');

class XpCommand extends Command {
  constructor () {
    super('xp', {
      aliases: ['xp'],
      cooldown: 10000,
      ratelimit: 2
    });
  }

  exec (message) {
    // Get DB xp info
    let xp = this.client.db.get('xp');
    const userId = `u${message.author.id}`;

    // make the user an entry if it doesn't exist
    if (!xp.hasOwnProperty(userId)) xp[userId] = 0;

    return message.channel.send(this.client.util.embed()
      .setAuthor(message.author.username, message.author.avatarURL)
      .setTitle(`You have ${xp[userId]} xp`));
  }
}

module.exports = XpCommand;
