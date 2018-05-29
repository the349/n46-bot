const { Listener } = require('discord-akairo');

class UnhandledRejectionListener extends Listener {
  constructor () {
    super('unhandledRejection', {
      eventName: 'unhandledRejection',
      emitter: process
    });
  }

  exec (error) {
    this.client.logger.error(error, {module: 'N46Bot'});

    if (this.client.akairoOptions.hasOwnProperty('dev') && this.client.akairoOptions.dev) {
      console.error(error);
    }
  }
}

module.exports = UnhandledRejectionListener;
