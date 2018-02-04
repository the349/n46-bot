const { Listener } = require('discord-akairo');

class MessageListener extends Listener {
  constructor () {
    super('message', {
      eventName: 'message',
      emmiter: 'client',
      cooldown: 120000
    });
  }

  exec (message) {
    // Don't count commands
    if (message.content && message.content.startsWith(this.client.config.client.prefix)) {
      return;
    }

    // Don't count the bot's own messages (or other bots)
    if (message.member && message.member.user.id === this.client.user.id) return;

    // Don't count if the user has gotten xp in the last 2min
    const userId = `u${message.author.id}`;
    if (this.client.sessiondb.xpWaits.hasOwnProperty(userId)) return;

    // Get DB xp info
    let xp = this.client.db.get('xp');

    // Make the xp key if it doesn't exist
    if (!xp) xp = {};

    // Make the user an entry if it doesn't exist
    if (!xp.hasOwnProperty(userId)) xp[userId] = 0;

    // Give the user a random 10-16
    xp[userId] += 1 + Math.floor(Math.random());

    // Update the DB
    this.client.db.set('xp', xp);

    // Add a timer to limit xp increases to only two minutes
    this.client.sessiondb.xpWaits[userId] = setTimeout(() => {
      delete this.client.sessiondb.xpWaits[userId];
    }, 120000);

    // Check if the user has level-uped any rankgroups
    const rankgroups = this.client.db.get('rankgroups');

    // Don't bother with ranks if there aren't any
    if (!rankgroups) return;
    Object.keys(rankgroups).forEach((rankgroup) => {
      const possibleRanks = rankgroups[rankgroup].requirements
        .reduce((possibleRanks, requirement, index) => {
          if (requirement !== '0' && parseInt(requirement) <= xp[userId]) {
            possibleRanks.push(null);
          }
          return possibleRanks;
        }, []);

      // Give the new rank if there is one
      if (possibleRanks.length > 0) {
        // Ok this is a very hard thing to fine-tune
        // First we get to the rankgroup header index
        // Then we subtract down to the last rank in that group
        // Then we add up to get the highest rank available
        const newRank = message.guild.roles.find('calculatedPosition',
          rankgroups[rankgroup].index - (rankgroups[rankgroup].requirements.length - 1) + (possibleRanks.length - 2));

        // Only give out new ranks
        if (!message.member.roles.find('name', newRank.name)) {
          rankgroups[rankgroup].roles.forEach((role) => {
            if (message.member.roles.find('name', role.name)) {}
            message.member.removeRole(message.guild.roles.find('name', role.name));
          });
          message.member.addRole(newRank);
          message.channel.send(this.client.util.embed()
            .setAuthor(message.member.displayName, message.member.user.avatarURL)
            .addField('Level Up!', `Congratulations! You're now a ${newRank.name}`));
        }
      }
    });
  }
}

module.exports = MessageListener;
