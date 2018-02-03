const { Command } = require('discord-akairo');
const logger = require('../../bot/logger');

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
    const rankgroups = {};
    const rolegroups = roles.reduce((rolegroups, role) => {
      if (/^([exr])?:([\w\s\d]+):([\d:]+)?$/.test(role.name)) {
        const rolegroupName = role.name.replace(/^([exr])?:([\w\s\d]+):([\d:]+)?$$/, '$2');

        // Add role
        rolegroups[rolegroupName] = {
          name: role.name,
          exclusive: role.name.startsWith('e'),
          nogive: (role.name.startsWith('x') || role.name.startsWith('r')), // don't give out ranks
          rankgroup: role.name.startsWith('r'),
          index: role.calculatedPosition,
          roles: []
        };

        if (role.name.startsWith('r')) {
          rankgroups[rolegroupName] = {
            name: role.name,
            index: role.calculatedPosition,
            roles: []
          };
          rankgroups[rolegroupName].requirements = role.name
            .replace(/^([exr])?:([\w\s\d]+):([\d:]+)?$/, '$3').split(':');
        }
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

              // Add rank requirements if this is a rankgroup
              if (rolegroups[rolegroup].rankgroup) {
                rankgroups[rolegroup].roles.push({
                  name: role.name,
                  requirement: rankgroups[rolegroup].requirements[rankgroups[rolegroup].roles.length]
                });
              }
            }
          } else {
            // If it is the last header,
            // all the roles after it are in that group
            roleEntries[role.name] = rolegroup;
            rolegroups[rolegroup].roles.push(role.name);

            // Add rank requirements if this is a rankgroup
            if (rolegroups[rolegroup].rankgroup) {
              rankgroups[rolegroup].roles.push({
                name: role.name,
                requirement: rankgroups[rolegroup].requirements[rankgroups[rolegroup].roles.length]
              });
            }
          }
        }

        return roleEntries;
      }, roleEntries);
    }, {});

    // Update the database
    this.client.db.set('rolegroups', rolegroups);
    this.client.db.set('roles', roleEntries);
    this.client.db.set('rankgroups', rankgroups);
    logger.log('updateRolesCommand', 'Roles updated');
    return message.react('✅');
  }
}

module.exports = UpdateRolesCommand;
