const config = require('./config.json');
const N46Client = require('./lib/bot/client.js');
const logger = require('./lib/bot/logger');

if (process.argv[2]) config.client.token = process.argv[2];

config.client.emmiters = {
  process: process
};

// Start the client and input the token
const client = new N46Client(config.client, config, {
  disableEveryone: true
});

logger.log('core', 'Logging In...');

client.login(config.client.token).then(() => {
  logger.log('core', 'BOT STARTED');
  client.updateGuilds();
});
