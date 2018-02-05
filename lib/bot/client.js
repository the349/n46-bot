const { AkairoClient } = require('discord-akairo');
const EnmapLevel = require('enmap-level');
const logger = require('./logger');
const Enmap = require('enmap');
const level = new EnmapLevel({ name: 'bot' });
const db = new Enmap({ provider: level });
const { writeFile } = require('fs');

// Set up db
db.defer.then(() => {
  logger.log('db', db.size + ' keys loaded');
});

class N46Client extends AkairoClient {
  constructor (clientConfig, fullConfig) {
    super(clientConfig);
    this.db = db;
    this.sessiondb = {
      xpWaits: {}
    };
    this.config = fullConfig;
  }

  // Rewrite the config file
  writeConfig () {
    writeFile('../../config.json', JSON.stringify(this.config), (err) => {
      logger.error('N46Client.writeConfig', err);
      logger.log('N46Client.writeConfig', 'The bot\'s config data may be corrupted!');
    });
  }
}

module.exports = N46Client;
