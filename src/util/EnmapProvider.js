const { Provider } = require('discord-akairo');
const { Collection } = require('discord.js');
const logger = require('../util/logger');

class EnmapProvider extends Provider {
  /**
   * Creates a provider for an EnMap database
   * @extends Provider
   * @param enmap enmap database to use
   */
  constructor (enmap) {
    super();
    this.enmap = enmap;
  }

  /**
   * Converts the whole enmap to a collection
   * Rather than just using a cache
   * USING THIS IS NOT ADVISED
   * @return Collection a collection containing all the enmap items
   */
  get items () {
    logger.warn('Using the items entry of EnmapProvider is not advised',
      { module: 'EnmapProvider' });

    return this.enmap.reduce((items, value, key) => {
      items.set(key, value);
      return items;
    }, new Collection());
  }

  // :shrug:
  set items (val) {}

  async init () {
    await this.enmap.defer;
    logger.info(`${this.enmap.size} keys loaded from database ${this.enmap.db.name}`,
      { module: 'EnmapProvider' });
  }

  /**
   * Gets a id-key pair from the database
   * @param  any id ID of entry
   * @param  string key key of data from ID
   * @param  any defaultValue what to default to if data isn't found
   * @return any data if found, or defaultValue
   */
  get (id, key, defaultValue) {
    if (this.enmap.has(id)) {
      const value = this.enmap.get(id)[key];
      return value == null ? defaultValue : value;
    }

    return defaultValue;
  }

  /**
   * Gets all keys for an ID
   * @param  any id
   * @return object all keys from that ID
   */
  getAll (id) {
    return this.enmap.get(id) || {};
  }

  /**
   * Sets a id-key pair from the database
   * @param  any id ID of entry
   * @param  string key key of data from ID
   * @param  any value what to set the id-key pair to
   * @return any the new value
   */
  set (id, key, value) {
    const data = this.enmap.get(id) || {};
    data[key] = value;
    this.enmap.set(id, data);
  }

  /**
   * Deletes an id-key pair without deleting the ID
   * @param  any id ID of entry
   * @param  {[type]} key key to delete from ID
   * @return null
   */
  delete (id, key) {
    const data = this.enmap.get(id) || {};
    delete data[key];
    this.enmap.set(id, data);
    return this.get(id, key);
  }

  /**
   * Clears an id from the database
   * @param  {[type]} id ID to delete
   */
  clear (id) {
    this.enmap.delete(id);
  }
}

module.exports = EnmapProvider;
