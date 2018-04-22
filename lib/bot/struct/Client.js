const { AkairoClient } = require('discord-akairo');
const ClientUtil = require('./ClientUtil');
const logger = require('../util/logger');
const CommandHandler = require('./CommandHandler');
const Guild = require('./Guild');
const { Collection } = require('discord.js');
const UnmuteCommand = require('../../commands/mod/unmute');
const ModMail = require('../modmail');

class N46Client extends AkairoClient {
  constructor (config, db) {
    config.client.commandDirectory = './lib/commands';
    config.client.inhibitorDirectory = './lib/inhibitors';
    config.client.listenerDirectory = './lib/listeners';
    super(config.client);
    this.commandHandler = new CommandHandler(this, config.client);
    this.db = db;
    this.config = config;
    this.logger = logger;
    this.util = new ClientUtil(this);
  }

  startModMail () {
    this.modmail = new ModMail(this);
  }

  updateGuilds () {
    this.guilds.forEach((guild) => {
      // If there is no update method, add all the extensions
      if (!guild.hasOwnProperty('update')) {
        guild = ClientUtil.extend(guild, Guild);
        guild.stars = (guild.stars || new Collection());
        guild.joins = (guild.joins || new Collection());
      }

      guild.update();
    });
  }

  addTimer (action, data, time) {
    let timers = this.db.get('timers');
    if (!timers) timers = {};

    const id = 't' + data.ids.member.toString();

    timers[id] = {
      id,
      action,
      data,
      time: new Date().getTime() + time
    };

    setTimeout(() => {
      this.runTimer(id, action, data);
    }, time);

    this.db.set('timers', timers);
  }

  runTimer (id, action, data) {
    let timers = this.db.get('timers');
    if (!timers) timers = {};
    if (!timers.hasOwnProperty(id)) return;

    if (action === 'unmute') {
      UnmuteCommand.unmute(this, data);
      delete timers[id];
    }

    this.db.set('timers', timers);
  }

  setupTimers () {
    let timers = this.db.get('timers');
    if (!timers) timers = {};
    this.db.set('timers', timers);

    Object.keys(timers).forEach((id) => {
      const timer = timers[id];
      setTimeout(() => {
        this.runTimer(timer.id, timer.action, timer.data);
      }, timer.time - new Date().getTime());
    });
  }
}

module.exports = N46Client;
