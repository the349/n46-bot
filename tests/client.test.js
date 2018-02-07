const N46Client = require('../lib/bot/client');
const fake = require('./fake');
const expect = require('chai').expect;

describe('N46Client', () => {
  describe('updateRoleGroups', () => {
    it('Should properly create a rolegroups collection', async () => {
      const rolegroups = await N46Client.updateRoleGroups(fake.guild).rolegroups;
      rolegroups.forEach((val, key) => {
        expect(val).to.deep.equal(fake.rolegroups.get(key));
      });
    });
  });
});
