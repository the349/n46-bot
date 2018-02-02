const { Command } = require('discord-akairo');
const logger = require('../../logger');

class RoleCommand extends Command {
  constructor () {
    super('role', {
      aliases: ['role'],
      clientPermissions: ['MANAGE_ROLES'],
      args: [{
        id: 'roles',
        type: 'string',
        match: 'content'
      }]
    });
  }

  exec (message, args) {
    // Get role data from DB
    const roles = this.client.db.get('roles');
    const rolegroups = this.client.db.get('rolegroups');

    // Go through the requested roles
    args.roles.split(/\|/g).forEach((role) => {
      role = role.trim();

      // Make sure the role is giveable
      if (roles.hasOwnProperty(role) && !rolegroups[roles[role]].nogive) {
        // If it's exclusive remove the other roles in that group
        if (rolegroups[roles[role]].exclusive) {
          rolegroups[roles[role]].roles.forEach((role) => {
            if (message.member.roles.find('name', role)) {
              message.member.removeRole(message.guild.roles.find('name', role)).catch((err) => {
                logger.error('roleCommand', err);
              });
            }
          });
        }

        // If the user has the role, remove it
        if (message.member.roles.exists('name', role)) {
          message.member.removeRole(message.guild.roles.find('name', role));
        } else {
          // If the user doens't have it, add it
          message.member.addRole(message.guild.roles.find('name', role));
        }

        // Helpful success react
        return message.react('✅');
      } else {
        return message.channel.send(this.client.util.embed()
          .setAuthor(this.client.user.username, this.client.user.avatarURL)
          .setTitle('No such role is givable: ' + role));
      }
    });
  }
}

module.exports = RoleCommand;
