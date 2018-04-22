const { Listener } = require('discord-akairo');

class MessageListener extends Listener {
  constructor () {
    super('modmail', {
      eventName: 'message',
      emmiter: 'client'
    });
  }

  async exec (message) {
    if (message.author.bot ||
      message.content.startsWith(this.client.config.client.prefix) ||
      message.channel.type !== 'dm') {
      return;
    }
    return this.userMail(message);
  }

  async userMail (message) {
    if (!this.client.modmail.threads.has(message.author.id)) {
      this.client.modmail.start(message);
    } else {
      const thread = this.client.modmail.threads.get(message.author.id);
      await thread.relayChannel.send(this.client.modmail.relayMessage(message));
    }
  }
}

module.exports = MessageListener;
