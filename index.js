const config = require('./config.json');
const { AkairoClient } = require('discord-akairo');
const EnmapLevel = require('enmap-level');
const Enmap = require('enmap');
const level = new EnmapLevel({ name: 'bot' });
const db = new Enmap({ provider: level });

// Set up db
db.defer.then(() => {
  console.log('db', db.size + ' keys loaded');
});

if (process.argv[2]) config.client.token = process.argv[2];

config.client.emmiters = {
  process: process
};

class N46Client extends AkairoClient {
  constructor (config, fullConfig, db) {
    super(config);
    this.config = fullConfig;
    this.db = db;
  }
}

// Start the client and input the token
const client = new N46Client(config.client, config, db);

console.log('core', 'Logging In...');

client.login(config.client.token).then(() => {
  console.log('core', 'BOT STARTED');
});
