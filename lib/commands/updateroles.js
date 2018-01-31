const { Command } = require('discord-akairo');
const logger = require('../logger');

class UpdateRolesCommand extends Command {
  constructor () {
    super('updateroles', {
      aliases: ['updateroles', 'uproles']
    });
  }

  exec (message) {
    const roles = message.guild.roles;
    const rolegroups = roles.reduce((rolegroups, role) => {
      if (/^[e]?:[\w\s]+:$/.test(role.name)) {
        rolegroups[role.name.replace(/(^e|:)/g, '')] = {
          name: role.name,
          exclusive: role.name.startsWith('e'),
          nogive: role.name.startsWith('x'),
          index: role.calculatedPosition,
          roles: []
        };
      }
      return rolegroups;
    }, {});

    const roleEntries = roles.reduce((roleEntries, role) => {
      return Object.keys(rolegroups).reduce((roleEntries, rolegroup, index, rolegroupKeys) => {
        if (roles.find('name', rolegroups[rolegroup].name).calculatedPosition > role.calculatedPosition) {
          if (rolegroupKeys.length - 1 > index) {
            if (roles.find('name', rolegroups[rolegroupKeys[index + 1]].name).calculatedPosition < role.calculatedPosition) {
              roleEntries[role.name] = rolegroup;
              rolegroups[rolegroup].roles.push(role.name);
            }
          } else {
            roleEntries[role.name] = rolegroup;
            rolegroups[rolegroup].roles.push(role.name);
          }
        }

        return roleEntries;
      }, roleEntries);
    }, {});

    this.client.db.set('rolegroups', rolegroups);
    this.client.db.set('roles', roleEntries);
    logger.log('updateRolesCommand', 'Roles updated');
  }
}

module.exports = UpdateRolesCommand;
