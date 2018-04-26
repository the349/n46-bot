const { Command } = require('../../bot');

class EndCommand extends Command {
  constructor () {
    super('end', {
      aliases: ['end']
    });
  }

  exec (message) {
    if (!message.guild) {
      this.client.modmail.end(message.author.id);
    } else {
      this.client.modmail.end(message.channel.name);
    }
  }
}

module.exports = EndCommand;
