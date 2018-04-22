const { Command } = require('../../bot');

class UpdateCommand extends Command {
  constructor () {
    super('config', {
      aliases: ['config'],
      botPermissions: ['READ_CONFIG', 'EDIT_CONFIG'],
      channelRestriction: 'guild',
      args: [{
        id: 'category',
        type: 'string'
      }, {
        id: 'key',
        type: 'string'
      }, {
        id: 'value',
        type: 'dynamicInt',
        prompt: {
          start: 'Who would you like the new value to be? or type "get" to get the current value'
        }
      }, {
        id: 'force',
        match: 'flag',
        prefix: 'force'
      }, {
        id: 'array',
        match: 'flag',
        prefix: 'array'
      }]
    });
  }

  exec (message, { category, key, value, force, array }) {
    // Make sure what they're editing exists
    if (!force) {
      if (!message.guild.config.hasOwnProperty(category)) return message.reply('No such category!');
      if (!message.guild.config[category].hasOwnProperty(key)) return message.reply('No such key!');
    } else {
      if (!message.guild.config.hasOwnProperty(category)) message.guild.config[category] = {};
      message.guild.config[category][key] = array ? [] : undefined;
    }

    // If a value is given, set it, otherwise display the value
    if (value !== 'get') {
      if (Array.isArray(message.guild.config[category][key])) {
        value.split(/,\s{0,}/).forEach((value) => {
          if (message.guild.config[category][key].indexOf(value) > -1) {
            message.guild.config[category][key].pop(value);
          } else {
            message.guild.config[category][key].push(value);
          }
        });
      } else {
        message.guild.config[category][key] = value;
      }
      message.guild.updateConfig();
      return message.react('✅');
    } else {
      return message.reply(`The current value is: ${message.guild.config[category][key]}`);
    }
  }
}

module.exports = UpdateCommand;
