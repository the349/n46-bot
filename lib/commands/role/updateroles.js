const { Command } = require('discord-akairo');
const logger = require('../../logger');

class UpdateRolesCommand extends Command {
  constructor () {
    super('uproles', {
      aliases: ['updateroles', 'uproles'],
      userPermissions: ['MANAGE_ROLES']
    });
  }

  exec (message) {
    const roles = message.guild.roles;

    // Go through each role and find the headers
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

    // Go through each roles again and match them with rolegroups
    const roleEntries = roles.reduce((roleEntries, role) => {
      // Go through the rolegroups to find the right matchs
      return Object.keys(rolegroups).reduce((roleEntries, rolegroup, index, rolegroupKeys) => {
        // Check if role is after rolegroup header
        if (roles.find('name', rolegroups[rolegroup].name).calculatedPosition > role.calculatedPosition) {
          // Check if it's the last rolegroup in the list
          if (rolegroupKeys.length - 1 > index) {
            // If it isn't, make sure it's before the next header
            if (roles.find('name', rolegroups[rolegroupKeys[index + 1]].name).calculatedPosition < role.calculatedPosition) {
              roleEntries[role.name] = rolegroup;
              rolegroups[rolegroup].roles.push(role.name);
            }
          } else {
            // If it is the last header,
            // all the roles after it are in that group
            roleEntries[role.name] = rolegroup;
            rolegroups[rolegroup].roles.push(role.name);
          }
        }

        return roleEntries;
      }, roleEntries);
    }, {});

    // Update the database
    this.client.db.set('rolegroups', rolegroups);
    this.client.db.set('roles', roleEntries);
    logger.log('updateRolesCommand', 'Roles updated');
  }
}

module.exports = UpdateRolesCommand;
