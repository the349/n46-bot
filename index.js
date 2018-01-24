const fs = require('fs');
const Akairo = require('discord-akairo');
const logger = require('./lib/logger');

// Get configuration information
config = JSON.parse(fs.readFileSync(__dirname + "/config.json").toString());

config.ownerID = parseInt(process.argv[2]);
config.token = process.argv[3];

// Start the client and input the token
client = new Akairo.AkairoClient(config, {disableEveryone: true});

logger.log('core', 'Logging In...');

client.login(config.token).then(() => {
  logger.log('core', 'BOT STARTED');
});
