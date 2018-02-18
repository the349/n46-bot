const { Command } = require('discord-akairo');

class RoleCommand extends Command {
  constructor () {
    super('role', {
      aliases: ['role', 'channel'],
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
    const roles = message.guild.roles;

    // Go through the requested roles
    args.roles.split(/\|/g).forEach((role) => {
      role = role.trim();

      // Make sure the role is giveable
      if (roles.find('name', role) && !roles.find('name', role).group.nogive) {
        const rolegroup = roles.find('name', role).group;

        // If it's exclusive remove the other roles in that group
        if (rolegroup.exclusive) {
          rolegroup.roles.forEach((role) => {
            if (message.member.roles.find('name', role.name)) {
              message.member.removeRole(role).catch((err) => {
                this.client.logger.error(err, {module: 'roleCommand'});
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
