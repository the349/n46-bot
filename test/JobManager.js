const expect = require('chai').expect;
const Enmap = require('enmap');
const JobManager = require('../src/util/JobManager');
const logger = require('../src/util/logger');

describe('EnmapProvider', function () {
  const db = new Enmap();

  db.set('101010101', {
    time: new Date().getTime() + 10,
    action: 'test',
    args: 'arrrg i’m a pirate'
  });

  // {} would normally be the client, which has the logger property
  const manager = new JobManager(db, { logger });

  let actionCompleted = false;
  manager.action('test', function (client, args) {
    actionCompleted = (args === 'arrrg i’m a pirate');
  });

  it('should run pre-scheduled actions', function (done) {
    manager.scheduleAll();

    setTimeout(function () {
      expect(actionCompleted).to.equal(true);
      done();
    }, 10);
  });

  let action2Completed = false;

  manager.action('test2', function (client, args) {
    action2Completed = (args === 'arrrg i used to be pirate but i turned my life around');
  });

  it('should run post-scheduled actions', function (done) {
    manager.schedule('010101010', {
      time: new Date().getTime() + 10,
      action: 'test2',
      args: 'arrrg i used to be pirate but i turned my life around'
    });

    setTimeout(function () {
      expect(action2Completed).to.equal(true);
      done();
    }, 10);
  });

  let action3Completed = false;

  manager.action('test3', function (client, args) {
    action3Completed = (args === 'this should never run');
  });

  it('should not run deleted jobs', function (done) {
    manager.schedule('123123123', {
      time: new Date().getTime() + 10,
      action: 'test3',
      args: 'this should never run'
    });

    manager.unschedule('123123123');

    setTimeout(function () {
      expect(action3Completed).to.equal(false);
      done();
    }, 10);
  });
});
