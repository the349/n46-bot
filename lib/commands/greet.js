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
    args.member.addRole(message.guild.roles.find('name', 'Newcomers')).catch((err) => {
      logger.error('greetCommand', err);
    });

    message.reply(args.member + ' has been greeted!');
  }
}

module.exports = GreetCommand;
