const { Collection } = require('discord.js');
const Enmap = require('enmap');
const db = new Enmap();

const fake = {};

fake.db = db;

fake.db.set('xp', {
  u0000: 0
});

fake.roles = new Collection([
  [14, {position: 14, id: 14, name: 'Admin'}],
  [13, {position: 13, id: 13, name: 'Mod'}],
  [12, {position: 12, id: 12, name: ':Color:'}],
  [11, {position: 11, id: 11, name: 'Red'}],
  [10, {position: 10, id: 10, name: 'Blue'}],
  [9, {position: 9, id: 9, name: 'e:Age:'}],
  [8, {position: 8, id: 8, name: '25'}],
  [7, {position: 7, id: 7, name: '24'}],
  [6, {position: 6, id: 6, name: 'r:Ranks:100:20:25:0:'}],
  [5, {position: 5, id: 5, name: 'Ranked! ULTRA XL', requirement: 100}],
  [4, {position: 4, id: 4, name: 'Ranked! ULTRA', requirement: 20}],
  [3, {position: 3, id: 3, name: 'Ranked!', requirement: 25}],
  [2, {position: 2, id: 2, name: 'Newcomers', requirement: 0}],
  [1, {position: 1, id: 1, name: 'x:Other:'}],
  [0, {position: 0, id: 0, name: '@everyone'}]
]);

fake.rolegroups = new Collection([
  ['Color', {
    headerText: ':Color:',
    exclusive: false,
    nogive: false,
    rankgroup: false,
    position: 12,
    roles: new Collection(),
    requirements: []
  }],
  ['Age', {
    headerText: 'e:Age:',
    exclusive: true,
    nogive: false,
    rankgroup: false,
    position: 9,
    roles: new Collection(),
    requirements: []
  }],
  ['Ranks', {
    headerText: 'r:Ranks:100:20:25:0:',
    exclusive: true,
    nogive: true,
    rankgroup: true,
    position: 6,
    roles: new Collection(),
    requirements: ['100', '20', '25', '0']
  }],
  ['Other', {
    headerText: 'x:Other:',
    exclusive: false,
    nogive: true,
    rankgroup: false,
    position: 1,
    roles: new Collection(),
    requirements: []
  }]
]);

fake.guild = {
  name: 'A Fake Testing Guild',
  stars: [],
  roles: fake.roles
};

fake.client = {
  guilds: new Collection([[0, fake.guild]])
};

fake.cooldownStorage = new Collection();

fake.cooldown = {
  storage: fake.cooldownStorage,
  key: 'u000000000000000001',
  time: 100
};

module.exports = fake;
