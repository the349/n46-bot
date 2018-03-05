const { Command } = require('../../bot');

// Tested and works: 2018-02-21
// No edits since

class TopCommand extends Command {
  constructor () {
    super('top', {
      aliases: ['top'],
      cooldown: 60000,
      ratelimit: 2
    });
  }

  exec (message) {
    // Get DB xp info
    const xp = this.client.db.get('xp');

    // Sort the xp ascending and get the last ten
    const top10 = Object.keys(xp).sort((a, b) => {
      if (message.guild.members.has(a.slice(1))) {
        return xp[a] - xp[b];
      } else {
        // Skip users not in this server
        return -1;
      }
    }).slice(-10).reverse();

    // Build a list of the top 10 users
    const users = top10.reduce((users, id) => {
      if (message.guild.members.has(id.slice(1))) {
        users.push({
          xp: xp[id],
          user: message.guild.members.get(id.slice(1))
        });
      }

      return users;
    }, []);

    message.channel.send(this.client.util.embed()
      .setDescription(users
        .map((user, index) => { return `#${index + 1}: ${user.xp}xp ${user.user.user.username}`; })
        .join('\n'))
      .setTitle(`Top 10 List for ${message.guild.name}`));
  }
}

module.exports = TopCommand;
