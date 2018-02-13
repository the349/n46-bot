const { AkairoClient } = require('discord-akairo');
const { Collection } = require('discord.js');
const logger = require('winston');

class N46Client extends AkairoClient {
  constructor (clientConfig, fullConfig, db) {
    super(clientConfig);
    this.db = db;
    this.config = fullConfig;
    this.logger = logger;
  }

  // Utility function that creates cooldown timers for
  // functions, and gives the option to run an alternative
  // when it fails
  static cooldown ({ storage, key, time }) {
    const cooldown = {
      fails: [],
      succeeds: [],
      fail: fn => { cooldown.fails.push(fn); return cooldown; },
      succeed: fn => { cooldown.succeeds.push(fn); return cooldown; }
    };

    cooldown.run = () => {
      if (storage.has(key)) {
        cooldown.fails.forEach((x) => {
          return x();
        });
      } else {
        cooldown.succeeds.forEach((x) => {
          return x();
        });

        storage.set(key, setTimeout(() => {
          storage.delete(key);
        }, time));
      }
    };

    return cooldown;
  }

  // Sets up guilds with a handy update function, and runs it
  updateGuilds () {
    let config = this.db.get('config');
    if (!config) config = {};

    this.guilds.forEach((guild) => {
      guild.update = () => {
        // Update local config with guild-based config
        if (guild.hasOwnProperty('config')) config[guild.name] = guild.config;

        // Replace empty config with defaults
        if (!config.hasOwnProperty(guild.name)) {
          config[guild.name] = this.config.defaults;
          logger.info('updateGuild', `Default configuration applied to guild ${guild.name}`);
        }

        guild.config = config[guild.name];
        this.updateGuild(guild);
        this.db.set('config', config);
      };
      guild.update();
    });
  }

  // Utility function that creates a rolegroups and roles entry for a guild
  updateGuild (guild) {
    guild.stars = [];

    guild.rolegroups = N46Client.updateRoleGroups(guild);
    logger.info('updateRoleGroups', `Role groups updated for guild ${guild.name}`);

    const updatedData = N46Client.updateRoles(guild);
    guild.roles = updatedData.roles;
    guild.rolegroups = updatedData.rolegroups;
    logger.info('updateRoles', `Roles updated for guild ${guild.name}`);
  }

  // Utility function that parses roles for headers,
  // and creates rolegroups entries for them
  static updateRoleGroups ({ roles }) {
    const roleHeaderFormat = /^([exr])?:([\w\s]+):(((\d+:)+)?)$/;

    const rolegroups = roles.reduce((rolegroups, role) => {
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

    return rolegroups;
  }

  // Utility function that maps roles to their rolegroups
  static updateRoles ({ rolegroups, roles }) {
    const roleHeaderFormat = /^([exr])?:([\w\s]+)(:(\d+)?)+$/;

    // Go through each role and add it to a rolegroup
    rolegroups = roles.reduce((rolegroups, role) => {
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
    }, rolegroups);

    return { roles, rolegroups };
  }
}

module.exports = N46Client;
