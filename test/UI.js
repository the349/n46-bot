const expect = require('chai').expect;
const UI = require('../src/util/UI');

describe('UI', function () {
  it('should properly create a codeblock for an object', function () {
    const obj = {
      'hello': 'world',
      'id': 123123123
    };

    const display = '```yaml\nhello: world\nid: 123123123```';

    expect(UI.objectToCodeblock(obj)).to.equal(display);
  });
});
