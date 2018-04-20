const { Listener } = require('discord-akairo');
const sanitize = require('../../bot/sanity.js');

class MessageListener extends Listener {
  constructor () {
    super('censor', {
      eventName: 'message',
      emmiter: 'client'
    });
  }

  exec (message) {
    if (!message.guild.config.censor.on) return;
    if (message.type !== 'DEFAULT') return;
    const words = message.guild.config.censor.words;
    const content = message.content.toLowerCase().split(/[\s.,/#!$%^&*;:{}=\-_`~()]+/);

    const del = content.reduce((del, word) => {
      if (del) return del;
      word = sanitize(word);
      return (words.indexOf(word) > -1);
    }, false);

    if (del) message.delete();
  }
}

module.exports = MessageListener;
