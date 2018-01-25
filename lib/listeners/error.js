const Akairo = require('discord-akairo');
const logger = require('../logger');

class UnhandledRejectionListener extends Akairo.Listener {
  constructor() {
    super('unhandledRejection', {
      eventName: 'unhandledRejection',
      emitter: process
    });
  }

  exec(error) {
    logger.error(error);
  }
}

module.exports = UnhandledRejectionListener;
