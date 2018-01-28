const { Command } = require('discord-akairo');

class MkRolesCommand extends Command {
  constructor () {
    super('mkroles', {
      aliases: ['mkroles'],
      clientPermissions: ['MANAGE_ROLES'],
      args: [{
        id: 'groupname',
        type: 'string'
      }, {
        id: 'exclusive',
        type: /^(yes|no|n|y)$/i
      }, {
        id: 'roles',
        match: 'content'
      }]
    });
  }

  userPermissions (message) {
    if (message.member.roles.find('name', 'Administrator')) {
      return true;
    } else {
      message.channel.send(this.client.util.embed()
        .setColor('#FF4136')
        .setAuthor(this.client.user.username, this.client.user.avatarURL)
        .addField('Command Failure', 'You cannot use this command!'));
    }
  }

  exec (message, args) {
    let rolegroups = this.client.db.get('rolegroups');
    const newroles = new Set(args.roles.replace(/[_]/g, ' ').split(/\s+/));

    if (!rolegroups) {
      this.client.db.set('rolegroups', {});
      rolegroups = this.client.db.get('rolegroups');
    }

    if (!rolegroups.hasOwnProperty(args.groupnames)) {
      rolegroups[args.groupname] = {
        exclusive: this.client.isYesNo(args.exclusive),
        roles: Array(...new Set(args.roles.replace(/[_]/g, ' ').split(/\s+/)))
      };
    } else {
      rolegroups[args.groupname].exclusive = this.client.isYesNo(args.exclusive);
      rolegroups[args.groupname].roles = Array(...new Set([...rolegroups[args.groupname].roles, ...newroles]));
    }

    this.client.db.set('rolegroups', rolegroups);

    let roles = this.client.db.get('roles');
    if (!roles) {
      this.client.db.set('roles', {});
      roles = this.client.db.get('roles');
    }

    newroles.forEach((role) => {
      roles[role] = args.groupname;
    });

    this.client.db.set('roles', roles);
    return message.react('✅');
  }
}

module.exports = MkRolesCommand;
