const { Command } = require('../../bot');
const { promisify } = require('util');
let { readFile } = require('fs');
readFile = promisify(readFile);

class VersionCommand extends Command {
  constructor () {
    super('version', {
      aliases: ['version'],
      botPermissions: ['QUIT_BOT']
    });
  }

  async exec (message) {
    const packageJSON = await readFile('./package.json');
    const version = JSON.parse(packageJSON).version;
    message.reply(`I am running version ${version}`);
  }
}

module.exports = VersionCommand;
