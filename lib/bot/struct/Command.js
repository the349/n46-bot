const { Command } = require('discord-akairo');

class N46Command extends Command {
  constructor (id, exec, options) {
    super(id, exec, options);
    if (!options && typeof exec === 'object') {
      options = exec;
      exec = null;
    }

    this.botPermissions = options.botPermissions;
  }
}

module.exports = N46Command;
