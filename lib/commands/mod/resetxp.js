const { Command } = require('discord-akairo');

class ResetXPCommand extends Command {
  constructor () {
    super('resetxp', {
      aliases: ['resetxp'],
      userPermissions: ['MANAGE_ROLES'],
      args: [{
        id: 'member',
        type: 'member'
      }]
    });
  }

  exec (message, { member }) {
    let xp = this.client.db.get('xp');
    let rankgroups = this.client.db.get('rankgroups');
    xp[`u${member.user.id}`] = 0;
    this.client.db.set('xp', xp);
    Object.keys(rankgroups).forEach((rankgroup) => {
      rankgroups[rankgroup].roles.forEach((role) => {
        if (message.member.roles.find('name', role.name)) {
          message.member.removeRole(message.guild.roles.find('name', role.name));
        }
      });
    });
    return message.react('✅');
  }
}

module.exports = ResetXPCommand;
