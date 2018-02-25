const { Collection } = require('discord.js');

const rolesUtil = {};

rolesUtil.checkMetRanks = (rolegroups, roles, xp) => {
  return rolegroups.reduce((metRanks, rolegroup, key) => {
    if (rolegroup.rankgroup) {
      // Find the highest met rank
      const metRank = rolegroup.roles.reduce((metRank, role) => {
        if (role.requirement === 0) return metRank;

        if (xp >= role.requirement) {
          if (metRank && metRank.requirement > role.requirement) {
            return metRank;
          }
          return role;
        }

        return metRank;
      }, null);

      // Add the rank if we found one
      if (metRank) {
        metRanks.set(metRank.id, metRank);
      } else {
        // remove rankgroup if there's no met ranks
        metRanks.set(key, null);
      }
    }

    return metRanks;
  }, new Collection());
};

module.exports = rolesUtil;
