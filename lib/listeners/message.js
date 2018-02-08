const { Listener } = require('discord-akairo');
const { Collection } = require('discord.js');
const { cooldown } = require('../bot/client');

class MessageListener extends Listener {
  constructor () {
    super('message', {
      eventName: 'message',
      emmiter: 'client'
    });

    this.cooldowns = new Collection();
  }

  static checkMetRanks (rolegroups, roles, xp) {
    return rolegroups.reduce((metRanks, rolegroup, key) => {
      if (rolegroup.rankgroup) {
        // Find the highest met rank
        const metRank = rolegroup.roles.sort((a, b) => {
          // First sort by requirement, highest first
          return b.requirement - a.requirement;
        }).find((role) => {
          // Don't give out 0-requirement r
          if (role.requirement === 0) return false;
          // Check if the user has met the requirement
          return (xp > role.requirement);
        });

        // Add the rank if we found one
        if (metRank) {
          metRanks.set(metRank.id, metRank);
        } else {
          // remove rankgroup if there's no met ranks
          metRanks.set(key, null);
        }
      }

      return metRanks;
    }, new Collection());
  }

  updateXp (message) {
    const userId = `u${message.author.id}`;

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

    // Check if the user has level-uped any rankgroups
    const metRanks = MessageListener
      .checkMetRanks(message.guild.rolegroups, message.member.roles, xp[userId]);

    if (metRanks) {
      metRanks.forEach((rank, key) => {
        // remove rankgroup if there's no met ranks
        if (!rank) {
          return message.guild.rolegroups.get(key).roles.forEach((rank) => {
            if (message.member.roles.exists('id', rank.id)) {
              if (message.member.roles.exists('id', rank.id)) message.member.removeRole(rank);
            }
          });
        }
        // Make sure the user doesn't already have it
        if (!message.member.roles.exists('id', rank.id)) {
          rank.group.roles.forEach((rank) => {
            if (message.member.roles.exists('id', rank.id)) message.member.removeRole(rank);
          });

          message.member.addRole(rank);
          message.channel.send(this.client.util.embed()
            .setAuthor(message.author.username, message.author.avatarURL)
            .setTitle(`Your rank is now ${rank.name}`));
        }
      });
    }
  }

  exec (message) {
    // Don't count
    if (!this.client.config.xp.on || // if xp is disabled
      !message.guild || // if it's a dm
      message.author.bot || // if it's this bot or another bot
      message.content.startsWith(this.client.config.client.prefix)) { // if it's a command
      return;
    }

    const userId = `u${message.author.id}`;

    // Don't count if the user has gotten xp in the last cooldownMinutes
    cooldown({
      storage: this.cooldowns,
      key: userId,
      time: this.client.config.xp.cooldownMinutes * 60000
    }).succeed(() => {
      this.updateXp(message);
    }).run();
  }
}

module.exports = MessageListener;
