const { Listener } = require('discord-akairo');

class MessageListener extends Listener {
  constructor () {
    super('modmail', {
      eventName: 'message',
      emmiter: 'client'
    });
  }

  exec (message) {
    if (message.channel.type !== 'dm' || message.author.bot) return;
    if (!this.client.modmail.threads.has(message.author.id)) {
      this.client.modmail.start(message);
    }
  }
}

module.exports = MessageListener;
