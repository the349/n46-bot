const { Command } = require('../../bot');
const { promisify } = require('util');
let { readFile } = require('fs');
readFile = promisify(readFile);

class VersionCommand extends Command {
  constructor () {
    super('about', {
      aliases: ['about', 'version'],
      botPermissions: ['QUIT_BOT']
    });
  }

  async exec (message) {
    const packageJSON = await readFile('./package.json');
    const version = JSON.parse(packageJSON).version;
    const usage = Math.round(10 * process.memoryUsage().heapTotal / 1024 / 1024) / 10;
    message.channel.send(this.client.util.embed().setDescription(
      this.client.util.description({
        version, usage: `${usage} MB`
      })
    ));
  }
}

module.exports = VersionCommand;
