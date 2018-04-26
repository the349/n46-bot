const { Command } = require('../../bot');

// Tested and works: 2018-02-21
// No edits since

class UpdateCommand extends Command {
  constructor () {
    super('up', {
      aliases: ['update', 'up'],
      channelRestriction: 'guild',
      botPermissions: ['UPDATE_GUILD']
    });
  }

  exec (message) {
    message.guild.update();
    return message.react('✅');
  }
}

module.exports = UpdateCommand;
