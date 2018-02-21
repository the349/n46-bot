const { Command } = require('discord-akairo');

// Tested and works: 2018-02-21
// No edits since

class RolesCommand extends Command {
  constructor () {
    super('roles', {
      aliases: ['roles']
    });
  }

  exec (message, args) {
    const msg = message.guild.rolegroups.reduce((msg, rolegroup, name) => {
      if (rolegroup.nogive) return msg;
      const roles = rolegroup.roles.map((role) => {
        return role.name;
      });

      return msg.addField(name, roles.join(' '));
    }, this.client.util.embed());
    msg.setAuthor(this.client.user.username, this.client.user.avatarURL);

    message.channel.send(msg);
  }
}

module.exports = RolesCommand;
