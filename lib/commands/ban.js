const { Command } = require('discord-akairo');

class GreetCommand extends Command {
  constructor () {
    super('ban', {
      aliases: ['ban'],
      clientPermissions: ['BAN_MEMBERS'],
      userPermissions: ['BAN_MEMBERS'],
      args: [{
        id: 'member',
        type: 'member'
      }, {
        id: 'erase',
        type: /^(yes|no|n|y)$/i
      }]
    });
  }

  exec (message, args) {
    // Send messages if the user/bot cannot ban the person
    // It's ok if both messages are sent when both are applicable (makes for easier troubleshooting)
    if (!args.member.bannable) {
      message.reply(this.client.embed()
        .addField('Command Failure', 'I cannot ban this user.')
      );
    }

    if (message.member.highestRole.calculatedPosition <= args.member.highestRole.calculatedPosition) {
      message.reply(this.client.embed()
        .addField('Command Failure', 'You do not have permission to ban this user.\nTheir position is higher than yours.')
      );
    }

    let days = 0;
    if (this.client.isYesNo(this.erase)) {
      days = 10000;
    }

    args.member.ban({
      reason: args.reason,
      days: days
    });
  }
}

module.exports = GreetCommand;
