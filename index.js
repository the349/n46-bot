const Enmap = require('enmap');
const EnmapLevel = require('enmap-level');
const Client = require('./src/client/N46Client.js');
const databases = Enmap.multi(['config', 'users', 'jobs'], EnmapLevel);
const config = require('./config.json');

config.emmiters = { process };
const client = new Client(config, databases);

client.logger.info('Logging on...', { module: 'N46Client' });

client.start(config.token)
  .then(() => { client.logger.info('Logged in.', { module: 'N46Client' }); })
  .catch((err) => { client.emit('error', err); });
