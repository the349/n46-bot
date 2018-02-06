const { Listener } = require('discord-akairo');

class MessageListener extends Listener {
  constructor () {
    super('message', {
      eventName: 'message',
      emmiter: 'client'
    });
  }

  exec (message) {
    // Don't count
    if (!this.client.config.xp.on || // if xp is disabled
      !message.guild || // if it's a dm
      message.author.bot || // if it's this bot or another bot
      message.content.startsWith(this.client.config.client.prefix)) { // if it's a command
      return;
    }
    // Don't count if the user has gotten xp in the last 2min
    const userId = `u${message.author.id}`;
    if (this.client.sessiondb.xpWaits.hasOwnProperty(userId)) return;

    // Get DB xp info
    let xp = this.client.db.get('xp');

    // Make the xp key if it doesn't exist
    if (!xp) xp = {};

    // Make the user an entry if it doesn't exist
    if (!xp.hasOwnProperty(userId)) xp[userId] = 0;

    // Give the user a random xp from the range
    xp[userId] += this.client.config.xp.xpIncreaseRange[0] +
      Math.floor(Math.random() * this.client.config.xp.xpIncreaseRange[1]);

    // Update the DB
    this.client.db.set('xp', xp);

    // Add a timer to limit xp increases per configuration
    this.client.sessiondb.xpWaits[userId] = setTimeout(() => {
      delete this.client.sessiondb.xpWaits[userId];
    }, this.client.config.xp.cooldownMinutes * 60000);

    // Check if the user has level-uped any rankgroups
    const metRanks = message.guild.rolegroups.reduce((metRanks, rolegroup) => {
      if (rolegroup.rankgroup) {
        // Find the highest met rank
        const metRank = rolegroup.roles.sort((a, b) => {
          // First sort by requirement, highest first
          return b.requirement - a.requirement;
        }).find((role) => {
          // Check if the user has met the requirement
          return (xp[userId] > role.requirement);
        });

        // Add the rank if we found one
        if (metRank) {
          metRanks.set(metRank.id, metRank);
        } else {
          // Remove all if we didn't (they don't meet any ranks)
          rolegroup.roles.forEach((rank) => {
            if (message.member.roles.exists('id', rank.id)) message.member.removeRole(rank);
          });
        }
      }

      return metRanks;
    }, this.client.util.collection());

    if (metRanks) {
      metRanks.forEach((rank) => {
        // Make sure the user doesn't already have it
        if (!message.member.roles.exists('id', rank.id)) {
          rank.group.roles.forEach((rank) => {
            if (message.member.roles.exists('id', rank.id)) message.member.removeRole(rank);
          });

          message.member.addRole(rank);
          message.channel.send(this.client.util.embed()
            .setAuthor(message.author.username, message.author.avatarURL)
            .setTitle(`You've level-uped to ${rank.name}`));
        }
      });
    }
  }
}

module.exports = MessageListener;
