const { AkairoClient } = require('discord-akairo');
const ClientUtil = require('./ClientUtil');
const logger = require('./logger');
const CommandHandler = require('./CommandHandler');
const Guild = require('./Guild');
const { Collection } = require('discord.js');

class N46Client extends AkairoClient {
  constructor (config, db) {
    config.client.commandDirectory = './lib/commands';
    config.client.inhibitorDirectory = './lib/inhibitors';
    config.client.listenerDirectory = './lib/listeners';
    super(config.client);
    this.commandHandler = new CommandHandler(this, config.client);
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
        guild.stars = (guild.stars || new Collection());
        guild.joins = (guild.joins || new Collection());
      }

      guild.update();
    });
  }
}

module.exports = N46Client;
