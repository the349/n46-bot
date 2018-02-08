const { Collection } = require('discord.js');
const N46Client = require('../lib/bot/client');
const MessageListener = require('../lib/listeners/message');
const { expect } = require('chai');
let fake = require('./fake');

describe('MessageListener', function () {
  describe('createXpWait', function () {
    it('Create a xp cooldown', function () {
      MessageListener.createXpWait('u0000', fake.client);
      expect(fake.client.sessiondb.xpWaits).to.have.property('u0000');
    });

    this.timeout(6);

    it('Self-destruct xp cooldown', function () {
      expect(fake.client.sessiondb.xpWaits).not.to.have.property('u0000');
    });
  });

  describe('checkMetRanks', function () {
    fake.guild.rolegroups = N46Client.updateRoleGroups(fake.guild);
    const fakeRanked = fake.roles.get(4);
    const { rolegroups, roles } = N46Client.updateRoles(fake.guild);
    const ranked = MessageListener.checkMetRanks(rolegroups, new Collection(), 30);
    const nothing = MessageListener.checkMetRanks(rolegroups, new Collection(), 0);
    const nothing2 = MessageListener.checkMetRanks(rolegroups,
       new Collection([[4, fakeRanked]]), 10);

     console.log(ranked);
    it('Give correct ranks', function () {
      expect(ranked.get(4)).deep.equal(roles.get(4));
    });

    it('Do nothing when no ranks are givable', function () {
      expect(nothing).deep.equal(new Collection([['Ranks', null]]));
    });

    it('Remove & replace existing ranks', function () {
      expect(nothing2).deep.equal(new Collection([['Ranks', null]]));
    });
  });
});
