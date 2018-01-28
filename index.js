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

    // Helpful for reaction sequences
    this.reactor = (message, reaction) => {
      return () => {
        return message.react(reaction);
      };
    };

    this.isYesNo = (yesOrNo) => {
      if (yesOrNo.match[0].toLowerCase() === 'yes') {
        return true;
      } else if (yesOrNo.match[0].toLowerCase() === 'no') {
        return false;
      }
    };
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
