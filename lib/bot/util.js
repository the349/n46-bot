const util = {};

// combines an object with an object of extensions
util.extend = (object, extension) => {
  return Object.keys(extension).reduce((object, key) => {
    object[key] = () => {
      extension[key](object);
    };
    return object;
  }, object);
};

// combines an object with an object of extensions without calling the object itself
util.extendKeys = (object, extension) => {
  return Object.keys(extension).reduce((object, key) => {
    object[key] = extension[key];
    return object;
  }, object);
};

// Internal cooldown function
util.cooldown = (storage, key, time) => {
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
};

util.computeTime = ({ milliseconds, seconds, minutes, hours, days }) => {
  return milliseconds + 1000 * seconds + 60000 * minutes + 3600000 * hours +
         86400000 * days;
};

util.chunkArrayInGroups = (arr, size) => {
  const result = [];
  let pos = 0;
  while (pos < size) {
    result.push(arr.slice(pos, pos + size));
    pos += size;
  }
  return result;
};

module.exports = util;
