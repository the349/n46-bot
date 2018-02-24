const { Command } = require('discord-akairo');
const { promisify } = require('util');
let { readFile } = require('fs');
readFile = promisify(readFile);

// Tested and works: 2018-02-21
// No edits since

class UpdateCommand extends Command {
  constructor () {
    super('version', {
      aliases: ['version']
    });
  }

  userPermissions (message) {
    // Only allow people with QUIT_BOT permission to quit the bot
    const perms = message.guild.config.permissions.QUIT_BOT.map((role) => {
      return message.member.roles.exists('name', role);
    });
    return perms.indexOf(true) > -1;
  }

  async exec (message) {
    const packageJSON = await readFile('./package.json');
    const version = JSON.parse(packageJSON).version;
    message.reply(`I am running version ${version}`);
  }
}

module.exports = UpdateCommand;
