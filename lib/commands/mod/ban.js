const { Command } = require('../../bot');
const { MessageCollector } = require('discord.js');

class BanCommand extends Command {
  constructor () {
    super('ban', {
      aliases: ['ban'],
      channelRestriction: 'guild',
      clientPermissions: ['BAN_MEMBERS'],
      args: [{
        id: 'member',
        type: 'member'
      }, {
        id: 'reason',
        match: 'content'
      }]
    });
  }

  async exec (message, { member, reason }) {
    // Manually check if the banner could ban the user themself
    // Block the command if the user couldn't
    if (!message.member.hasPermission('BAN_MEMBERS') ||
        !message.member.highestRole.calculatedPosition > member.highestRole.calculatedPosition) {
      return this.client.commandHandler.emit('commandBlocked', message, this, 'userPermissions');
    }

    const prompt = new MessageCollector(message.channel, (promptMessage) => {
      return (message.author.id === promptMessage.author.id);
    });

    message.reply('type `confirm`, typing anything else will cancel the ban.');

    prompt.on('collect', async (message) => {
      prompt.stop();
      if (message.content !== 'confirm') return message.reply('ban cancelled');

      try {
        await member.ban();
        await message.reply('"ban"');
        message.react('✅');
      } catch (error) {
        this.client.logger.error(error, {module: 'banCommand'});
      }
    });
  }
}

module.exports = BanCommand;
