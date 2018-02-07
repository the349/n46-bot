const { createXpWait } = require('../lib/listeners/message');
const { expect } = require('chai');
let fake = require('./fake');

describe('MessageListener', function () {
  describe('createXpWait', function () {
    it('Create a xp cooldown', function () {
      createXpWait('u0000', fake.client);
      expect(fake.client.sessiondb.xpWaits).to.have.property('u0000');
    });

    this.timeout(6);

    it('Self-destruct xp cooldown', function () {
      expect(fake.client.sessiondb.xpWaits).not.to.have.property('u0000');
    });
  });
});
