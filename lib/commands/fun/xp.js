const { Command } = require('../../bot');

// Tested and works: 2018-02-21
// No edits since

class XpCommand extends Command {
  constructor () {
    super('xp', {
      aliases: ['xp'],
      cooldown: 60000,
      channelRestriction: 'guild',
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
    const userId = `u${message.author.id}`;
    const xp = this.client.enmap.get('xp', userId, 0);
    const xpAll = this.client.enmap.getAll('xp');

    // Sort the xp ascending and get the last ten
    const top = Object.keys(xpAll).filter((id) => {
      if (message.guild.members.has(id.slice(1))) {
        return xpAll[id] > xp;
      } else {
        // Skip users not in this server
        return false;
      }
    });

    return message.channel.send(this.client.util.embed()
      .setAuthor(member.user.username)
      .setThumbnail(member.user.avatarURL)
      .setColor(member.displayHexColor)
      .setDescription(`\`\`\`yaml\nXP: ${xp}\nRank: ${top.length + 1}\`\`\``));
  }
}

module.exports = XpCommand;
