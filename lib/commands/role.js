const { Command } = require('discord-akairo');
const logger = require('../logger');

class RoleCommand extends Command {
  constructor () {
    super('role', {
      aliases: ['role'],
      clientPermissions: ['MANAGE_ROLES'],
      args: [{
        id: 'roles',
        match: 'content'
      }]
    });
  }

  exec (message, args) {
    const roles = this.client.db.get('roles');
    const rolegroups = this.client.db.get('rolegroups');

    args.roles.replace(/[_]/g, ' ').split(/\s+/).forEach((role) => {
      if (roles.hasOwnProperty(role)) {
        rolegroups[roles[role]].roles.forEach((role) => {
          if (message.member.roles.find('name', role)) {
            message.member.removeRole(message.guild.roles.find('name', role)).catch((err) => {
              logger.error('roleCommand', err);
            });
          }
        });

        message.member.addRole(message.guild.roles.find('name', role));
        message.react('✅');
      } else {
        message.channel.send(this.client.util.embed()
          .setAuthor(this.client.user.username, this.client.user.avatarURL)
          .setTitle('No such role is givable: ' + role));
      }
    });
  }
}

module.exports = RoleCommand;
