module.exports = {
  log: function (component, text) {
    console.log(`. [${new Date().getTime()}] [${component}] ${text}`);
  },

  error: function (component, text) {
    console.error(`! [${new Date().getTime()}] [${component}]`, text);
  }
};
