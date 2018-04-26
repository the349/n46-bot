const { Command } = require('../../bot');

// Tested and works: 2018-02-21
// No edits since

class RolesCommand extends Command {
  constructor () {
    super('roles', {
      aliases: ['roles'],
      channelRestriction: 'guild'
    });
  }

  exec (message, args) {
    const msg = message.guild.rolegroups.array().reverse().reduce((msg, rolegroup) => {
      if (rolegroup.nogive) return msg;
      const roles = rolegroup.roles.map((role) => {
        return role.name;
      });

      // Just in case someone deletes all the roles in a role group without
      // Removing the header
      if (roles.length > 0 && rolegroup.name.length > 0) {
        return msg.addField(rolegroup.name, roles.join(', '));
      } else {
        return msg;
      }
    }, this.client.util.embed());
    msg.setAuthor(this.client.user.username, this.client.user.avatarURL);

    message.channel.send(msg);
  }
}

module.exports = RolesCommand;
