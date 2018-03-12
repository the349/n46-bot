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

    // Sort the xp ascending and get the last ten
    const top = Object.keys(xp).filter((id) => {
      if (message.guild.members.has(id.slice(1))) {
        return xp[id] > xp[userId];
      } else {
        // Skip users not in this server
        return false;
      }
    });

    return message.channel.send(this.client.util.embed()
      .setAuthor(member.user.username)
      .setThumbnail(member.user.avatarURL)
      .setColor(member.displayHexColor)
      .setDescription(`\`\`\`yaml\nXP: ${xp[userId]}\nRank: ${top.length + 1}\`\`\``));
  }
}

module.exports = XpCommand;
