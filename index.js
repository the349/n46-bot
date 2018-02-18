const config = require('./config.json');
const N46Client = require('./lib/bot/client');
const EnmapLevel = require('enmap-level');
const Enmap = require('enmap');
const level = new EnmapLevel({ name: 'bot' });
const db = new Enmap({ provider: level });

if (process.argv[2]) config.client.token = process.argv[2];

config.client.emmiters = {
  process: process
};

// Start the client and input the token
const client = new N46Client(config, db);

// Set up db
db.defer.then(() => {
  client.logger.info(db.size + ' keys loaded', {module: 'db'});
  client.logger.info('Logging In...', {module: 'core'});
  client.login(config.client.token).then(() => {
    client.logger.info('BOT STARTED', {module: 'core'});
    client.updateGuilds();
  });
});
