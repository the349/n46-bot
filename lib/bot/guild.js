const { Collection } = require('discord.js');
const { extender } = require('./util');
const logger = require('winston');
const guild = new Collection();

// Updates the guild's information
const update = (guild) => {
  let config = guild.client.db.get('config');
  if (!config) config = {};

  if (guild.hasOwnProperty('config')) config[guild.name] = guild.config;

  // Replace empty config with defaults
  if (!config.hasOwnProperty(guild.name)) {
    config[guild.name] = guild.client.config.defaults;
    logger.info('updateGuild', `Default configuration applied to guild ${guild.name}`);
  }

  guild.config = config[guild.name];
  guild.client.db.set('config', config);

  guild.updateRolegroups();
  logger.info('updateRolegroups', `Role groups updated for guild ${guild.name}`);

  guild.updateRoles();
  logger.info('updateRoles', `Roles updated for guild ${guild.name}`);
};

// Updates the guild's rolegroups
const updateRolegroups = (guild) => {
  const roleHeaderFormat = /^([exr])?:([\w\s]+):(((\d+:)+)?)$/;
  // Check for headers
  guild.rolegroups = guild.roles.reduce((rolegroups, role) => {
    if (roleHeaderFormat.test(role.name)) {
      const name = role.name.replace(roleHeaderFormat, '$2');
      rolegroups.set(name, {
        headerText: role.name,
        exclusive: /^[er].*/.test(role.name),
        nogive: /^[xr].*/.test(role.name),
        rankgroup: /^[r].*/.test(role.name),
        roles: new Collection(),
        position: role.position,
        requirements: role.name.replace(roleHeaderFormat, '$3').split(':').slice(0, -1)
      });
    }

    return rolegroups;
  }, new Collection());
};

const updateRoles = (guild) => {
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
      return rolegroup.position > role.position;
    });

    if (rolegroup) {
      if (rolegroup.rankgroup) {
        role.requirement = parseInt(rolegroup.requirements.pop());
      }
      rolegroup.roles.set(role.id, role);
      role.group = rolegroup;
    }

    return rolegroups;
  }, guild.rolegroups);
};

guild.set('update', update);
guild.set('updateRolegroups', updateRolegroups);
guild.set('updateRoles', updateRoles);
guild.set('stars', []);

// Extend guild with new functions
module.exports = extender(guild);
