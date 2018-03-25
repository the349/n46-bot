const { Command } = require('../../bot');

// Tested and works: 2018-02-21
// No edits since

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
    // Go through the requested roles
    args.roles.split(/\|/g).forEach((role) => {
      role = this.client.util.resolveRole(role.trim(), message.guild.roles);
      // Make sure the role is giveable
      if (role && !role.group.nogive) {
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
          .addField('No such role is givable: ' + role, 'Use !roles for a list of all roles'));
      }
    });
  }
}

module.exports = RoleCommand;
