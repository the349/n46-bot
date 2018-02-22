const { Command } = require('discord-akairo');

// Tested and works: 2018-02-21
// No edits since

class HelpCommand extends Command {
  constructor () {
    super('help', {
      aliases: ['help']
    });
  }

  exec (message, args) {
    return message.channel.send(this.client.util.embed()
      .setURL('https://n46-bot.github.io/#commands')
      .setTitle('Full Command Listing (click here)')
    );
  }
}

module.exports = HelpCommand;
