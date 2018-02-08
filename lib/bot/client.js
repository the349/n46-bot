const { AkairoClient } = require('discord-akairo');
const { Collection } = require('discord.js');
const logger = require('./logger');

class N46Client extends AkairoClient {
  constructor (clientConfig, fullConfig, db) {
    super(clientConfig);
    this.db = db;
    this.config = fullConfig;
  }

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

  updateGuilds () {
    this.guilds.forEach((guild) => {
      this.updateGuild(guild);
    });
  }

  updateGuild (guild) {
    guild.stars = [];

    guild.rolegroups = N46Client.updateRoleGroups(guild);
    logger.log('updateRoleGroups', `Role groups updated for guild ${guild.name}`);

    const updatedData = N46Client.updateRoles(guild);
    guild.roles = updatedData.roles;
    guild.rolegroups = updatedData.rolegroups;
    logger.log('updateRoles', `Roles updated for guild ${guild.name}`);
  }

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
