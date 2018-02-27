const { Listener } = require('discord-akairo');
const { Collection } = require('discord.js');

class MessageListener extends Listener {
  constructor () {
    super('message', {
      eventName: 'message',
      emmiter: 'client'
    });

    this.cooldowns = new Collection();
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
    xp[userId] += message.guild.config.xp.xpIncreaseRangeLow +
      Math.floor(Math.random() * !message.guild.config.xp.xpIncreaseRangeHigh);

    // Update the DB
    this.client.db.set('xp', xp);

    // Check if the user has level-uped any rankgroups
    const metRanks = this.client.util.checkMetRanks(message.guild.rolegroups, message.member.roles, xp[userId]);

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
    if (!message.guild.config.xp.on || // if xp is disabled
      !message.guild || // if it's a dm
      message.author.bot || // if it's this bot or another bot
      message.channel.name === message.guild.config.greeting.greetChannel || // If it's in intro
      message.content.startsWith(this.client.config.client.prefix)) { // if it's a command
      return;
    }

    const userId = `u${message.author.id}`;

    // Don't count if the user has gotten xp in the last cooldownMinutes
    this.client.util
      .cooldown(this.cooldowns, userId,
        message.guild.config.xp.cooldownMinutes * 60000).succeed(() => {
        this.updateXp(message);
      }).run();
  }
}

module.exports = MessageListener;
