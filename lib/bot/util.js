const util = {};

// combines an object with a collection of extensions
util.extend = (object, extension) => {
  return Object.keys(extension).reduce((object, key) => {
    object[key] = () => {
      extension[key](object);
    };
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

module.exports = util;
