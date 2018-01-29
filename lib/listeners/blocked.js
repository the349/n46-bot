const { Listener } = require('discord-akairo');
const logger = require('../logger');

class CommandBlockedListener extends Listener {
  constructor () {
    super('commandBlocked', {
      emitter: 'commandHandler',
      eventName: 'commandBlocked'
    });
  }

  exec (message, command, reason) {
    message.channel.send(this.client.util.embed()
      .setColor('#FF4136')
      .setAuthor(this.client.user.username, this.client.user.avatarURL)
      .addField('Command Failure', 'You cannot use this command!\n'));
    logger.log('cmd', `${command.id} blocked for ${reason}`);
  }
}

module.exports = CommandBlockedListener;
