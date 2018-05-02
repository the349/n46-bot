const { Provider } = require('discord-akairo');
const { Collection } = require('discord.js');
const logger = require('./logger');

class EnmapProvider extends Provider {
  constructor (enmap) {
    super();
    this.enmap = enmap;
  }

  // Converts the whole enmap to a collection
  // Rather than just using a cache
  // USING THIS IS NOT ADVISED
  get items () {
    logger.warn('Using the items entry of EnmapProvider is not advised', { module: 'EnmapProvider' });
    return this.enmap.reduce((items, value, key) => {
      items.set(key, value);
      return items;
    }, new Collection());
  }

  // :shrug:
  set items (val) {}

  async init () {
    await this.enmap.defer;
  }

  get (id, key, defaultValue) {
    if (this.enmap.has(id)) {
      const value = this.enmap.get(id)[key];
      return value == null ? defaultValue : value;
    }

    return defaultValue;
  }

  set (id, key, value) {
    const data = this.enmap.get(id) || {};
    data[key] = value;
    this.enmap.set(id, data);
    return this.get(id, key, value);
  }

  getAll (id) {
    return this.enmap.get(id) || {};
  }

  delete (id, key) {
    const data = this.enmap.get(id) || {};
    delete data[key];
    this.enmap.set(id, data);
    return this.get(id, key);
  }

  clear (id) {
    this.enmap.delete(id);
  }
}

module.exports = EnmapProvider;
