const { Listener } = require('discord-akairo');
const logger = require('../bot/logger');

class UnhandledRejectionListener extends Listener {
  constructor () {
    super('unhandledRejection', {
      eventName: 'unhandledRejection',
      emitter: process
    });
  }

  exec (error) {
    logger.error('core', error);
  }
}

module.exports = UnhandledRejectionListener;
