const { Command } = require('../../bot');

class ReplyCommand extends Command {
  constructor () {
    super('reply', {
      aliases: ['reply', 'r'],
      args: [{
        id: 'content',
        match: 'content'
      }]
    });
  }

  exec (message, { content }) {
    if (message.channel.parent === this.client.modmail.inboxCategory) return;
    let thread;
    if (!message.guild) {
      thread = this.client.modmail.threads.get(message.author.id);
    } else {
      thread = this.client.modmail.threads.get(message.channel.name);
    }

    message.content = content;
    thread.user.send(this.client.modmail.relayMessage(message));
  }
}

module.exports = ReplyCommand;
