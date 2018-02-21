const { Command } = require('discord-akairo');

class ReasonCommand extends Command {
  constructor () {
    super('reason', {
      aliases: ['reason'],
      clientPermissions: ['BAN_MEMBERS'],
      args: [{
        id: 'id',
        type: 'string'
      }, {
        id: 'reason',
        type: 'string',
        prompt: {
          start: 'Who would you like the reason to say?'
        }
      }]
    });
  }

  async exec (message, { id, reason }) {
    if (!message.guild.history.hasOwnProperty(id)) {
      return message.reply('I found no such action in my logs');
    }

    const entry = message.guild.history[id];

    entry.reason = reason;

    message.guild.updateHistory();

    message.channel
      .send(this.client.util.embed()
        .setColor('#FF4136')
        .addField(entry.type, await this.client.fetchUser(entry.user))
        .addField('Mod', await this.client.fetchUser(entry.mod))
        .addField('Reason', entry.reason)
        .setFooter(`id: ${id}`));
  }
}

module.exports = ReasonCommand;
