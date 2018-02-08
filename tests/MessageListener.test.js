const N46Client = require('../lib/bot/client');
const MessageListener = require('../lib/listeners/message');
const { Collection } = require('discord.js');
const { expect } = require('chai');
let fake = require('./fake');

describe('MessageListener', function () {
  describe('checkMetRanks', function () {
    fake.guild.rolegroups = N46Client.updateRoleGroups(fake.guild);
    const fakeRanked = fake.roles.get(4);
    const { rolegroups, roles } = N46Client.updateRoles(fake.guild);
    const ranked = MessageListener.checkMetRanks(rolegroups, new Collection(), 30);
    const nothing = MessageListener.checkMetRanks(rolegroups, new Collection(), 0);
    const nothing2 = MessageListener.checkMetRanks(rolegroups,
       new Collection([[4, fakeRanked]]), 10);

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
