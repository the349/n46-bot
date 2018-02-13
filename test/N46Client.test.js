/* eslint-env mocha */
const N46Client = require('../lib/client');
const { expect } = require('chai');
let fake = require('./fake');
const cooldown = N46Client.cooldown(fake.cooldown);

describe('N46Client', function () {
  describe('updateRoleGroups', function () {
    const rolegroups = N46Client.updateRoleGroups(fake.guild);

    it('Create a rolegroups entry for a regular rolegroup', function () {
      expect(rolegroups.get('Colors')).to.deep.equal(fake.rolegroups.get('Colors'));
    });

    it('Create a rolegroups entry for an exclusive rolegroup', function () {
      expect(rolegroups.get('Age')).to.deep.equal(fake.rolegroups.get('Age'));
    });

    it('Create a rolegroups entry for a ranking rolegroup', function () {
      expect(rolegroups.get('Ranks')).to.deep.equal(fake.rolegroups.get('Ranks'));
    });

    it('Create a rolegroups entry for a nongiving rolegroup', function () {
      expect(rolegroups.get('Other')).to.deep.equal(fake.rolegroups.get('Other'));
    });

    it('Create no extra rolegroup entries', function () {
      rolegroups.forEach((group, name) => {
        expect(rolegroups.has(name)).to.deep.equal(true);
      });
    });
  });

  describe('updateRoles', function () {
    fake.guild.rolegroups = N46Client.updateRoleGroups(fake.guild);
    const { roles } = N46Client.updateRoles(fake.guild);

    it('Create role entries', function () {
      fake.roles.forEach((group, name) => {
        expect(roles.has(name)).to.deep.equal(true);
      });
    });

    it('Create no extra role entries', function () {
      roles.forEach((role, name) => {
        expect(fake.roles.has(name)).to.deep.equal(true);
      });
    });

    it('Create rank entries with requirements', function () {
      roles.forEach((role, name) => {
        expect(role.requirements).to.deep.equal(fake.roles.get(name).requirements);
      });
    });
  });

  describe('cooldown', function () {
    it('A cooldown function that runs', function (done) {
      let isntDone = true;
      cooldown.succeed(function () {
        if (isntDone) {
          done();
          isntDone = false;
        }
      }).run();
    });

    it('A cooldown function fails when run too fast', function (done) {
      let isntDone = true;
      cooldown.fail(function () {
        if (isntDone) {
          done();
          isntDone = false;
        }
      }).run();
    });

    // Wait for twice as long to give some extra time for the function to run
    this.timeout(fake.cooldown.time * 2);

    it('A cooldown function runs after it has cooled', function (done) {
      setTimeout(function () {
        cooldown.succeed(done).run();
      }, fake.cooldown.time);
    });
  });
});
