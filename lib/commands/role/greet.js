const { Command } = require('discord-akairo');
const logger = require('../../logger');

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
    return message.member.roles.exists('name', 'Greeter');
  }

  exec (message, args) {
    // Give the newcomer the right role
    args.member.addRole(message.guild.roles.find('name', 'Newcomers')).catch((err) => {
      logger.error('greetCommand', err);
    });

    // Tell the greeter it worked
    message.member.guild.channels.find('name', 'greeters')
      .send(this.client.util.embed()
        .setColor('#2ECC40')
        .setAuthor(args.member.displayName, args.member.user.avatarURL)
        .addField('User Has Been Greeted', 'Remember to welcome them and tell them about #faq'));

    return message.react('✅');
  }
}

module.exports = GreetCommand;
