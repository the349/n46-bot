const { Command } = require('../../bot');
const { MessageCollector } = require('discord.js');

class ConfigCommand extends Command {
  constructor () {
    super('config', {
      aliases: ['config'],
      botPermissions: ['READ_CONFIG', 'EDIT_CONFIG'],
      args: [{
        id: 'action',
        type: ['get', 'set', 'add', 'remove', 'create']
      }, {
        id: 'category'
      }, {
        id: 'key'
      }]
    });
  }

  dynamicInt (content) {
    try {
      const int = parseInt(content);
      return (int || content);
    } catch (e) {
      return content;
    }
  }

  get ({ guild, category, key }) {
    if (!guild.config.hasOwnProperty(category)) return 'No such category exists!';
    if (!guild.config[category].hasOwnProperty(key)) return 'No such key exists!';
    return guild.config[category][key];
  }

  async set ({ message, category, key }) {
    if (!message.guild.config.hasOwnProperty(category)) return message.reply('No such category exists!');
    if (!message.guild.config[category].hasOwnProperty(key)) return message.reply('No such key exists!');

    message.reply('Please respond with the desired new value\nThe current value is: ' + this.get({
      guild: message.guild,
      category,
      key
    }));

    const collector = new MessageCollector(message.channel, (msg) => {
      return (msg.author === message.author);
    }, { max: 1 });

    collector.on('collect', (msg, collector) => {
      message.guild.config[category][key] = this.dynamicInt(msg.content);
      msg.react('✅');
      collector.stop();
    });
  }

  create ({ message, key, category }) {
    if (!message.guild.config.hasOwnProperty(category)) message.guild.config[category] = {};
    if (message.guild.config[category].hasOwnProperty(key)) return message.reply('That key already exists!');
    message.guild.config[category][key] = 0;
    message.reply('An empty entry has been made for that category/key');
  }

  add ({ message, key, category }) {
    if (!message.guild.config.hasOwnProperty(category)) return message.reply('No such category exists!');
    if (!message.guild.config[category].hasOwnProperty(key)) return message.reply('No such key exists!');
    if (!Array.isArray(message.guild.config[category][key])) return message.reply('Cannot add to a non-array');

    message.reply('Please respond with the desired new values (split with commas)\nThe current value is: ' + this.get({
      guild: message.guild,
      category,
      key
    }));

    const collector = new MessageCollector(message.channel, (msg) => {
      return (msg.author === message.author);
    }, { max: 1 });

    collector.on('collect', (msg, collector) => {
      msg.content.split(/,\s{0,}/).forEach((value) => {
        message.guild.config[category][key].push(this.dynamicInt(value));
      });

      msg.react('✅');
      collector.stop();
    });
  }

  remove ({ message, key, category }) {
    if (!message.guild.config.hasOwnProperty(category)) return message.reply('No such category exists!');
    if (!message.guild.config[category].hasOwnProperty(key)) return message.reply('No such key exists!');
    if (!Array.isArray(message.guild.config[category][key])) return message.reply('Cannot remove from a non-array');

    message.reply('Please respond with the desired values to remove (split with commas)\nThe current value is: ' + this.get({
      guild: message.guild,
      category,
      key
    }));

    const collector = new MessageCollector(message.channel, (msg) => {
      return (msg.author === message.author);
    }, { max: 1 });

    collector.on('collect', (msg, collector) => {
      msg.content.split(/,\s{0,}/).forEach((value) => {
        message.guild.config[category][key].pop(this.dynamicInt(value));
      });

      msg.react('✅');
      collector.stop();
    });
  }

  exec (message, { action, category, key }) {
    if (action === 'get') {
      message.reply(this.get({ category, key, guild: message.guild }));
    } else if (action === 'set') {
      this.set({ message, category, key });
    } else if (action === 'create') {
      this.create({ message, key, category });
    } else if (action === 'add') {
      this.add({ message, key, category });
    } else if (action === 'remove') {
      this.remove({ message, key, category });
    }

    message.guild.updateConfig();
  }
}

module.exports = ConfigCommand;
