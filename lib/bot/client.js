const { AkairoClient } = require('discord-akairo');
const logger = require('./logger');

class N46Client extends AkairoClient {
  constructor (clientConfig, fullConfig, db) {
    super(clientConfig);
    this.db = db;
    // TODO: Replace with marker on guild
    this.sessiondb = {
      xpWaits: {}
    };
    this.config = fullConfig;
  }

  updateGuilds () {
    this.guilds.forEach(guild => this.updateRoleGroups(guild));
  }

  updateRoleGroups (guild) {
    const roleHeaderFormat = /^([exr])?:([\w\s]+):(((\d+:)+)?)$/;

    guild.rolegroups = guild.roles.reduce((rolegroups, role) => {
      if (roleHeaderFormat.test(role.name)) {
        const name = role.name.replace(roleHeaderFormat, '$2');
        rolegroups.set(name, {
          headerText: role.name,
          exclusive: /^[e].*/.test(role.name),
          nogive: /^[xr].*/.test(role.name),
          rankgroup: /^[r].*/.test(role.name),
          position: role.calculatedPosition,
          roles: this.util.collection(),
          requirements: role.name.replace(roleHeaderFormat, '$3').split(':').slice(0, -1)
        });
      }

      return rolegroups;
    }, this.util.collection());

    logger.log('updateRoleGroups', `Rolegroups updated for ${guild.name}`);
    this.updateRoles(guild);
  }

  updateRoles (guild) {
    if (!guild.hasOwnProperty('rolegroups')) this.updateRoleGroups();
    const roleHeaderFormat = /^([exr])?:([\w\s]+)(:(\d+)?)+$/;

    // Go through each role and add it to a rolegroup
    guild.rolegroups = guild.roles.reduce((rolegroups, role) => {
      // Ignore headers
      if (roleHeaderFormat.test(role.name)) return rolegroups;
      // Go through each role group and check for a match
      const rolegroup = rolegroups.sort((a, b) => {
        // First sort them by position
        return a.position - b.position;
      }).find((rolegroup) => {
        return rolegroup.position > role.calculatedPosition;
      });

      if (rolegroup) {
        if (rolegroup.rankgroup) {
          role.requirement = rolegroup.requirements.pop();
        }
        rolegroup.roles.set(role.id, role);
        role.group = rolegroup;
      }

      return rolegroups;
    }, guild.rolegroups);

    logger.log('updateRoles', `Roles updated for ${guild.name}`);
  }
}

module.exports = N46Client;
