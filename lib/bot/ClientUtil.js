const { ClientUtil } = require('discord-akairo');
const { Collection } = require('discord.js');

class N46ClientUtil extends ClientUtil {
  // combines an object with an object of extensions
  static extend (object, extension) {
    return Object.keys(extension).reduce((object, key) => {
      object[key] = () => {
        extension[key](object);
      };
      return object;
    }, object);
  }

  // combines an object with an object of extensions without calling the object itself
  static extendKeys (object, extension) {
    return Object.keys(extension).reduce((object, key) => {
      object[key] = extension[key];
      return object;
    }, object);
  }

  cooldown (storage, key, time) {
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

  computeTime ({ milliseconds, seconds, minutes, hours, days }) {
    return milliseconds + 1000 * seconds + 60000 * minutes + 3600000 * hours +
           86400000 * days;
  }

  chunkArrayInGroups (arr, chunkSize) {
    var R = [];
    for (var i = 0; i < arr.length; i += chunkSize) {
      R.push(arr.slice(i, i + chunkSize));
    }
    return R;
  }

  checkMetRanks (rolegroups, roles, xp) {
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
  }
}

module.exports = N46ClientUtil;
