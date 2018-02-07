const N46Client = require('../lib/bot/client');
const expect = require('chai').expect;
let fake = require('./fake');

describe('N46Client.updateRoleGroups', function () {
  const rolegroups = N46Client.updateRoleGroups(fake.guild);

  it('should properly create a rolegroups entry for a regular rolegroup', function () {
    expect(rolegroups.get('Colors')).to.deep.equal(fake.rolegroups.get('Colors'));
  });

  it('should properly create a rolegroups entry for an exclusive rolegroup', function () {
    expect(rolegroups.get('Age')).to.deep.equal(fake.rolegroups.get('Age'));
  });

  it('should properly create a rolegroups entry for an ranking rolegroup', function () {
    expect(rolegroups.get('Ranks')).to.deep.equal(fake.rolegroups.get('Ranks'));
  });

  it('should properly create a rolegroups entry for an nongiving rolegroup', function () {
    expect(rolegroups.get('Other')).to.deep.equal(fake.rolegroups.get('Other'));
  });

  it('should not create any extra rolegroup entries', function () {
    rolegroups.forEach((group, name) => {
      expect(rolegroups.has(name)).to.deep.equal(true);
    });
  });
});
