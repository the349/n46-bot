const config = require('./config.json');
const N46Client = require('./lib/bot/client.js');
const logger = require('./lib/bot/logger');
const EnmapLevel = require('enmap-level');
const Enmap = require('enmap');
const level = new EnmapLevel({ name: 'bot' });
const db = new Enmap({ provider: level });

if (process.argv[2]) config.client.token = process.argv[2];

config.client.emmiters = {
  process: process
};

// Start the client and input the token
const client = new N46Client(config.client, config, db);

logger.log('core', 'Logging In...');

// Set up db
db.defer.then(() => {
  logger.log('db', db.size + ' keys loaded');

  client.login(config.client.token).then(() => {
    logger.log('core', 'BOT STARTED');
    N46Client.updateGuilds(client.guilds);
  });
});
