const { Command } = require('../../bot');

class EndCommand extends Command {
  constructor () {
    super('end', {
      aliases: ['end']
    });
  }

  exec (message) {
    this.client.modmail.end(message.author.id);
  }
}

module.exports = EndCommand;
