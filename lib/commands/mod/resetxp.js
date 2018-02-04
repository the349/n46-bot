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
    xp[member.id] = 0;
    this.clinet.db.set('xp', xp);
  }
}

module.exports = ResetXPCommand;
