const expect = require('chai').expect;
const Enmap = require('enmap');
const EnmapProvider = require('../src/util/EnmapProvider');

describe('EnmapProvider', function () {
  const enmap = new Enmap();

  const db = new EnmapProvider(enmap);

  it('should properly set and get values', function () {
    db.set('123456789', 'abc', 123);
    db.set('123456790', 'def', 456);
    expect(db.get('123456789', 'abc', null)).to.equal(123);
    expect(db.get('123456790', 'def', null)).to.equal(456);
  });

  it('should return the default value using get() improperly', function () {
    expect(db.get('123456789', 'def', -2)).to.equal(-2);
    expect(db.get('123456790', 'abc', -3)).to.equal(-3);
  });

  it('should delete entries without harming other entries', function () {
    db.delete('123456790', 'def');
    expect(db.get('123456790', 'def', -30)).to.equal(-30);
    expect(db.get('123456789', 'abc', -2)).to.equal(123);
  });

  it('should clear entries completely', function () {
    db.clear('123456789');
    expect(db.get('123456790', 'def', -30)).to.equal(-30);
    expect(db.get('123456789', 'abc', -2)).to.equal(-2);
  });
});
