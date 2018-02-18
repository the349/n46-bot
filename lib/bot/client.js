const { AkairoClient } = require('discord-akairo');
const logger = require('./logger');
const N46Guild = require('./guild');
const N46Util = require('./util');

class N46Client extends AkairoClient {
  constructor (config, db) {
    super(config.client);
    this.db = db;
    this.config = config;
    this.logger = logger;
    N46Util.extendKeys(this.util, N46Util);
  }

  updateGuilds () {
    this.guilds.forEach((guild) => {
      if (!guild.hasOwnProperty('update')) {
        guild = N46Util.extend(guild, N46Guild);
      }

      guild.update();
    });
  }
}

module.exports = N46Client;
