module.exports = {
  log: function (component, text) {
    const now = new Date().getTime();
    const output = '. [' + now + '] [' + component + '] ' + text;
    console.log(output);
  },

  error: function (component, text) {
    const now = new Date().getTime();
    const output = '! [' + now + '] [' + component + '] ' + text;
    console.log(output);
  }
};
