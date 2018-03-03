const { Command } = require('../../bot');

// Tested and works: 2018-02-21
// No edits since

class XpCommand extends Command {
  constructor () {
    super('xp', {
      aliases: ['xp'],
      cooldown: 60000,
      args: [{
        id: 'member',
        type: 'member',
        default: msg => msg.member
      }],
      ratelimit: 2
    });
  }

  exec (message, { member }) {
    // Get DB xp info
    let xp = this.client.db.get('xp');
    const userId = `u${member.id}`;

    // Make the xp key if it doens't exist
    if (!xp) xp = {};

    // make the user an entry if it doesn't exist
    if (!xp.hasOwnProperty(userId)) xp[userId] = 0;

    return message.channel.send(this.client.util.embed()
      .setAuthor(member.user.username, member.user.avatarURL)
      .setTitle(`${xp[userId]}xp`));
  }
}

module.exports = XpCommand;
