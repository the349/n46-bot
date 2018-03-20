const config = require('./config.json');
const defaults = require('./defaults.json');
const Client = require('./lib/bot/Client');
const EnmapLevel = require('enmap-level');
const Enmap = require('enmap');
const level = new EnmapLevel({ name: 'bot' });
const db = new Enmap({ provider: level });

config.defaults = defaults;

if (process.argv[2]) config.client.token = process.argv[2];

config.client.emmiters = {
  process: process
};

// Start the client and input the token
const client = new Client(config, db);

// Set up db
db.defer.then(() => {
  client.logger.info(db.size + ' keys loaded', {module: 'db'});
  client.logger.info('Logging In...', {module: 'core'});
  client.login(config.client.token).then(() => {
    client.logger.info('BOT STARTED', {module: 'core'});
    client.updateGuilds();
    client.setupTimers();
  }).catch(console.error);
}).catch(console.error);
