const { Listener } = require('discord-akairo');

class MessageListener extends Listener {
  constructor () {
    super('message', {
      eventName: 'message',
      emmiter: 'client',
      cooldown: 60000
    });
  }

  createXPTimeout (userId) {
  }

  exec (message) {
    // Get DB xp info
    let xp = this.client.db.get('xp');
    const userId = `u${message.member.user.id}`;

    // Make the xp key if it doens't exist
    if (!xp) xp = {};

    // Make the user an entry if it doesn't exist
    if (!xp.hasOwnProperty(userId)) xp[userId] = 0;

    // Give the user a random 10-16
    xp[userId] += 10 + Math.floor(Math.random() * 6);

    // Update the DB
    return this.client.db.set('xp', xp);
  }
}

module.exports = MessageListener;
