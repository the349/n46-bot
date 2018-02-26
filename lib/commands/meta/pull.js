const { Command } = require('discord-akairo');
const pm2 = require('pm2');

class PullCommand extends Command {
  constructor () {
    super('pull', {
      aliases: ['pull']
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
    pm2.list((err, list) => {
      if (err) console.error(err);
      pm2.pullAndRestart(list.find(o => o.pid === process.pid).name, (err, meta) => {
        if (err) return message.reply(err.msg);
        console.log(meta);
      });
    });
  }
}

module.exports = PullCommand;
