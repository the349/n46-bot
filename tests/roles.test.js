const N46Client = require('../lib/bot/client');
const expect = require('chai').expect;
let fake = require('./fake');

describe('N46Client.updateRoles', function () {
  fake.guild.rolegroups = N46Client.updateRoleGroups(fake.guild);
  const roles = N46Client.updateRoles(fake.guild);

  it('should properly create role entries', function () {
    fake.roles.forEach((group, name) => {
      expect(roles.has(name)).to.deep.equal(true);
    });
  });

  it('should not create any extra role entries', function () {
    roles.forEach((role, name) => {
      expect(fake.roles.has(name)).to.deep.equal(true);
    });
  });

  it('should properly create rank entries with requirements', function () {
    roles.forEach((role, name) => {
      expect(role.requirements).to.deep.equal(fake.roles.get(name).requirements);
    });
  });
});
