const { Command } = require('../../bot');
const { Collection } = require('discord.js');

class RoleCommand extends Command {
  constructor () {
    super('role', {
      aliases: ['role'],
      clientPermissions: ['MANAGE_ROLES'],
      channelRestriction: 'guild',
      args: [{
        id: 'roles',
        type: 'string',
        match: 'content'
      }]
    });
  }

  givableRoles (message) {
    return message.guild.roles.reduce((roles, role) => {
      if (role.hasOwnProperty('group') && !role.group.nogive) roles.set(role.id, role);
      return roles;
    }, new Collection());
  }

  exec (message, args) {
    // Go through the requested roles
    args.roles.split(/\|/g).forEach((role) => {
      // Don't resolve empty roles
      if (!role.trim()) return;

      role = this.client.util.resolveRole(role.trim(), this.givableRoles(message));

      if (role) {
        // If the user has the role, remove it
        if (message.member.roles.has(role.id)) {
          message.member.removeRole(role);
        } else {
          // If the user doens't have it, add it
          message.member.addRole(role);

          // If it's exclusive remove the other roles in that group
          if (role.group.exclusive) {
            role.group.roles.forEach((role) => {
              if (message.member.roles.has(role.id)) {
                message.member.removeRole(role).catch((err) => {
                  this.client.logger.error(err, {module: 'roleCommand'});
                });
              }
            });
          }
        }

        // Helpful success react
        return message.react('✅');
      } else {
        return message.channel.send(this.client.util.embed()
          .setAuthor(this.client.user.username, this.client.user.avatarURL)
          .addField('No such role is givable', 'Use !roles for a list of all roles'));
      }
    });
  }
}

module.exports = RoleCommand;
