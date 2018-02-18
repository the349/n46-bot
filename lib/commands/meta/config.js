const { Command } = require('discord-akairo');

class UpdateCommand extends Command {
  constructor () {
    super('config', {
      aliases: ['config'],
      args: [{
        id: 'category',
        type: 'string'
      }, {
        id: 'key',
        type: 'string'
      }, {
        id: 'value',
        type: 'dynamicInt'
      }]
    });
  }

  userPermissions (message) {
    const perms = message.guild.config.permissions.EDIT_CONFIG.map((role) => {
      return message.member.roles.exists('name', role);
    });
    return perms.indexOf(true) > -1;
  }

  exec (message, { category, key, value }) {
    if (!message.guild.config.hasOwnProperty(category)) return message.reply('No such category!');
    if (!message.guild.config[category].hasOwnProperty(key)) return message.reply('No such key!');

    if (value) {
      message.guild.config[category][key] = value;
    } else {
      message.reply(`The current value is: ${message.guild.config[category][key]}`);
    }
    message.guild.updateConfig();
    return message.react('✅');
  }
}

module.exports = UpdateCommand;
