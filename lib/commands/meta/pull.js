const { Command } = require('../../bot');
const pm2 = require('pm2');

class PullCommand extends Command {
  constructor () {
    super('pull', {
      channelRestriction: 'guild',
      botPermissions: ['PULL_UPDATES'],
      aliases: ['pull']
    });
  }

  async exec (message) {
    if (this.client.modmail.threads.size > 0) {
      return message.reply('I cannot restart while there are open ModMail conversations');
    }

    pm2.list((err, list) => {
      if (err) console.error(err);
      pm2.pullAndRestart(list.find(o => o.pid === process.pid).name, (err, meta) => {
        if (err) return message.reply(err.msg);
        message.reply('Update started, give it a moment to run `npm i`');
        this.client.logger.info(`Pulled with message ${meta}`, { module: 'pullCommand' });
      });
    });
  }
}

module.exports = PullCommand;
