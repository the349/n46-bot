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

  cooldown ({ storage, key, time }) {
    const cooldown = {
      fails: [],
      succeeds: [],
      fail: fn => { cooldown.fails.push(fn); return cooldown; },
      succeed: fn => { cooldown.succeeds.push(fn); return cooldown; }
    };

    cooldown.run = () => {
      if (storage.has(key)) {
        cooldown.fails.forEach((x) => {
          return x();
        });
      } else {
        cooldown.succeeds.forEach((x) => {
          return x();
        });

        storage.set(key, setTimeout(() => {
          storage.delete(key);
        }, time));
      }
    };

    return cooldown;
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
    this.cooldown({
      storage: this.cooldowns,
      key: userId,
      time: this.client.config.xp.cooldownMinutes * 60000
    }).succeed(() => {
      this.updateXp(message);
    }).run();
  }
}

module.exports = MessageListener;
