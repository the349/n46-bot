const { Command } = require('discord-akairo');
const logger = require('../logger');

class GreetCommand extends Command {
  constructor () {
    super('greet', {
      aliases: ['approve', 'greet'],
      clientPermissions: ['MANAGE_ROLES'],
      args: [{
        id: 'member',
        type: 'member'
      }]
    });
  }

  userPermissions (message) {
    if (message.member.roles.find('name', 'Greeter')) {
      return true;
    } else {
      message.reply('only greeters can use this command');
    }
  }

  exec (message, args) {
    const greeters = message.member.guild.channels.find('name', 'greeters');

    args.member.addRole(message.guild.roles.find('name', 'Newcomers')).catch((err) => {
      logger.error('greetCommand', err);
    });

    greeters.send(this.client.embed()
      .author(args.member, args.member.user.avatarURL)
      .addField('User Has Been Greeted', 'Remember to welcome them and tell them about #faq'));
  }
}

module.exports = GreetCommand;
