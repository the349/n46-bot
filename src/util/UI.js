class UI {
  static objectToCodeblock (obj) {
    const string = '```yaml';
    return Object.keys(obj).reduce((string, key) => {
      return string + `\n${key}: ${obj[key]}`;
    }, string) + '```';
  }
}

module.exports = UI;
