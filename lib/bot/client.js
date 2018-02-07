const { AkairoClient } = require('discord-akairo');
const { Collection } = require('discord.js');
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
    this.guilds.forEach((guild) => {
      this.updateGuild(guild);
    });
  }

  updateGuild (guild) {
    N46Client.updateRoleGroups(guild);
    logger.log('updateRoleGroups', `Role groups updated for guild ${guild.name}`);
    N46Client.updateRoles(guild);
    logger.log('updateRoles', `Roles updated for guild ${guild.name}`);
  }

  static updateRoleGroups (guild) {
    const roleHeaderFormat = /^([exr])?:([\w\s]+):(((\d+:)+)?)$/;

    guild.rolegroups = guild.roles.reduce((rolegroups, role) => {
      if (roleHeaderFormat.test(role.name)) {
        const name = role.name.replace(roleHeaderFormat, '$2');
        rolegroups.set(name, {
          headerText: role.name,
          exclusive: /^[er].*/.test(role.name),
          nogive: /^[xr].*/.test(role.name),
          rankgroup: /^[r].*/.test(role.name),
          position: role.calculatedPosition,
          roles: new Collection(),
          requirements: role.name.replace(roleHeaderFormat, '$3').split(':').slice(0, -1)
        });
      }

      return rolegroups;
    }, new Collection());

    return guild;
  }

  static updateRoles (guild) {
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
          role.requirement = parseInt(rolegroup.requirements.shift());
        }
        rolegroup.roles.set(role.id, role);
        role.group = rolegroup;
      }

      return rolegroups;
    }, guild.rolegroups);

    return guild;
  }
}

module.exports = N46Client;
