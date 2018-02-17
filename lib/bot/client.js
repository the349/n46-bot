const { AkairoClient } = require('discord-akairo');
const logger = require('winston');
const N46GuildExtender = require('./guild');
const N46Util = require('./util');

class N46Client extends AkairoClient {
  constructor (config, db) {
    super(config.client);
    this.db = db;
    this.config = config;
    this.logger = logger;
    this.util.cooldown = N46Util.cooldown;
  }

  updateGuilds () {
    this.guilds.forEach((guild) => {
      if (!guild.hasOwnProperty('update')) {
        guild = N46GuildExtender(guild);
      }

      guild.update();
    });
  }
}

module.exports = N46Client;
