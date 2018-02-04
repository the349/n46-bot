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
    xp[`u${member.user.id}`] = 0;
    this.client.db.set('xp', xp);
    return message.react('✅');
  }
}

module.exports = ResetXPCommand;
