const { AkairoClient } = require('discord-akairo');
const ClientUtil = require('./ClientUtil');
const logger = require('./logger');
const Guild = require('./Guild');

class N46Client extends AkairoClient {
  constructor (config, db) {
    config.client.commandDirectory = './lib/commands';
    config.client.listenerDirectory = './lib/listeners';

    super(config.client);
    this.db = db;
    this.config = config;
    this.logger = logger;
    this.util = new ClientUtil(this);
  }

  updateGuilds () {
    this.guilds.forEach((guild) => {
      // If there is no update method, add all the extensions
      if (!guild.hasOwnProperty('update')) {
        guild = ClientUtil.extend(guild, Guild);
        guild.stars = (guild.stars || []);
      }

      guild.update();
    });
  }
}

module.exports = N46Client;
