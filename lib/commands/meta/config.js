const { Command } = require('discord-akairo');

// Tested and works: 2018-02-21
// No edits since

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
    // Only allow people with the EDIT_CONFIG permission to edit config
    const perms = message.guild.config.permissions.EDIT_CONFIG.map((role) => {
      return message.member.roles.exists('name', role);
    });
    return perms.indexOf(true) > -1;
  }

  exec (message, { category, key, value }) {
    // Make sure what they're editing exists
    if (!message.guild.config.hasOwnProperty(category)) return message.reply('No such category!');
    if (!message.guild.config[category].hasOwnProperty(key)) return message.reply('No such key!');

    // If a value is given, set it, otherwise display the value
    if (value || value === 0) {
      message.guild.config[category][key] = value;
      message.guild.updateConfig();
      return message.react('✅');
    } else {
      return message.reply(`The current value is: ${message.guild.config[category][key]}`);
    }
  }
}

module.exports = UpdateCommand;
