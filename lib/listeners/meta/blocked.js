const { Listener } = require('discord-akairo');

class CommandBlockedListener extends Listener {
  constructor () {
    super('commandBlocked', {
      emitter: 'commandHandler',
      eventName: 'commandBlocked'
    });
  }

  exec (message, command, reason) {
    message.channel.send(this.client.util.embed()
      .setTitle('Command Denied')
      .setURL(`https://n46-bot.github.io/#commands/${command.id}`)
      .setColor('#FF4136')
      .setAuthor(this.client.user.username, this.client.user.avatarURL));

    this.client.logger.info(`Blocked for ${reason}`, {module: command.id + 'Command'});
  }
}

module.exports = CommandBlockedListener;
