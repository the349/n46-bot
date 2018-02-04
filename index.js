const config = require('./config.json');
const N46Client = require('./lib/bot/client.js');
const logger = require('./lib/bot/logger');

// Set up db
config.ownerID = parseInt(process.argv[2]);
config.token = process.argv[3];
config.emmiters = {
  process: process
};

// Start the client and input the token
const client = new N46Client(config.client, config, {
  disableEveryone: true
});

logger.log('core', 'Logging In...');

client.login(config.token).then(() => {
  logger.log('core', 'BOT STARTED');
});
