const { AkairoClient } = require('discord-akairo');
const Enmap = require('enmap');
const EnmapLevel = require('enmap-level');
const logger = require('./lib/logger');
const config = require('./config.json');

config.ownerID = parseInt(process.argv[2]);
config.token = process.argv[3];
config.emmiters = {
  process: process
};

const level = new EnmapLevel({ name: 'bot' });
const db = new Enmap({ provider: level });
// Set up db

db.defer.then(() => {
  logger.log('db', db.size + ' keys loaded');
});

class N46Client extends AkairoClient {
  constructor (config) {
    super(config);
    this.db = db;
  }

  // Checks if input says yes
  isYesNo (yesOrNo) {
    if (['yes', 'y'].indexOf(yesOrNo.match[0].toLowerCase()) > 0) {
      return true;
    } else {
      return false;
    }
  }
}

// Start the client and input the token
const client = new N46Client(config, {
  disableEveryone: true
});

logger.log('core', 'Logging In...');

client.login(config.token).then(() => {
  logger.log('core', 'BOT STARTED');
});
