const { Collection } = require('discord.js');

const fake = {};

fake.roles = new Collection([
  [14, {calculatedPosition: 14, name: 'Admin'}],
  [13, {calculatedPosition: 13, name: 'Mod'}],
  [12, {calculatedPosition: 12, name: ':Color:'}],
  [11, {calculatedPosition: 11, name: 'Red'}],
  [10, {calculatedPosition: 10, name: 'Blue'}],
  [9, {calculatedPosition: 9, name: 'e:Age:'}],
  [8, {calculatedPosition: 8, name: '25'}],
  [7, {calculatedPosition: 7, name: '24'}],
  [6, {calculatedPosition: 6, name: 'r:Ranks:100:20:25:0'}],
  [5, {calculatedPosition: 5, name: 'Ranked! ULTRA XL'}],
  [4, {calculatedPosition: 4, name: 'Ranked! ULTRA'}],
  [3, {calculatedPosition: 3, name: 'Ranked!'}],
  [2, {calculatedPosition: 2, name: 'Newcomers'}],
  [1, {calculatedPosition: 1, name: 'x:Other:'}],
  [0, {calculatedPosition: 0, name: '@everyone'}]
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
    headerText: 'r:Ranks:100:20:25:0',
    exclusive: true,
    nogive: false,
    rankgroup: false,
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
  roles: fake.roles
};

module.exports = fake;
