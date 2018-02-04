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

    // Don't count the bot's own messages
    if (message.member.user.id === this.client.user.id) return;

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
    xp[userId] += 10 + Math.floor(Math.random() * 6);

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

      // give them the rank role if they don't have it
      rankgroups[rankgroup].roles.forEach((role) => {
        if (message.member.roles.find('name', role.name)) {
          message.member.removeRole(message.guild.roles.find('name', role.name));
        }
      });

      // Give the new rank if there is one
      if (possibleRanks.length > 0) {
        const newRank = message.guild.roles.find('calculatedPosition',
          rankgroups[rankgroup].index + possibleRanks.length - rankgroups[rankgroup].requirements.length);

        message.member.addRole(newRank);
        message.channel.send(this.client.util.embed()
          .setAuthor(message.member.displayName, message.member.user.avatarURL)
          .addField('Level Up!', `Congratulations! You're now a ${newRank.name}`));
      }
    });
  }
}

module.exports = MessageListener;
