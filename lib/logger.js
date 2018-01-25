module.exports = {
  log: function(component, text) {
    now = new Date().getTime();
    output = ". [" + now + "] [" + component + "] " + text;
    console.log(output);
  },

  error: function(component, text) {
    now = new Date().getTime();
    output = "! [" + now + "] [" + component + "] " + text;
    console.log(output);
  }
};
