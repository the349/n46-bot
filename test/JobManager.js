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
});
