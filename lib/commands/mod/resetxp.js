const { Command } = require('discord-akairo');

class ResetXPCommand extends Command {
  constructor () {
    super('resetxp', {
      aliases: ['resetxp', 'dockxp'],
      userPermissions: ['MANAGE_ROLES'],
      args: [{
        id: 'member',
        type: 'member'
      }, {
        id: 'xpDecrease',
        type: 'number'
      }]
    });
  }

  exec (message, { member, xpDecrease }) {
    let xp = this.client.db.get('xp');

    if (xpDecrease) {
      xp[`u${member.user.id}`] -= xpDecrease;
    }

    if (!xpDecrease || xp[`u${member.user.id}`] < 0) {
      xp[`u${member.user.id}`] = 0;
    }

    this.client.db.set('xp', xp);
    return message.react('✅');
  }
}

module.exports = ResetXPCommand;
