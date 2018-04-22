const { CommandHandlerEvents } = require('discord-akairo/src/util/Constants');
const { CommandHandler } = require('discord-akairo');

class N46Command extends CommandHandler {
  _runInhibitors (message, command) {
    // If the command is already blocked, skip other blocks
    if (super._runInhibitors(message, command)) return true;

    // Check for bot permissions
    if (command.botPermissions) {
      if (typeof command.botPermissions === 'function') {
        if (!command.botPermissions(message)) {
          this.emit(CommandHandlerEvents.COMMAND_BLOCKED, message, command.options, 'botPermissions');
          return true;
        }
      } else {
        let perms = command.botPermissions.reduce((perms, botPermission) => {
          const hasPerm = message.guild.config.permissions[botPermission].map((role) => {
            return message.member.roles.exists('name', role);
          }).indexOf(true) > -1;

          if (!hasPerm && perms) {
            perms = false;
          }

          return perms;
        }, true);

        if (!perms) {
          this.emit(CommandHandlerEvents.COMMAND_BLOCKED, message, command, 'botPermissions');
          return true;
        }
      }
    }

    return false;
  }
}

module.exports = N46Command;
