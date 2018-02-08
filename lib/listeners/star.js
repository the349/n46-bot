const { Listener } = require('discord-akairo');

class StarListener extends Listener {
  constructor () {
    super('messageReactionAdd', {
      eventName: 'messageReactionAdd',
      emmiter: 'client'
    });
  }

  exec (reaction) {
    // Don't count
    if (!this.client.config.star.on || // If stars are turned off
        reaction.emoji.name !== '⭐' || // If the reation wasn't a star
        reaction.message.author.bot || // If it was a bot message
        reaction.message.guild.stars.indexOf(reaction.message.id) > -1 || // If it's been posted already
        this.client.config.star.ignoreChannels.indexOf(reaction.message.channel.name) > -1 || // If it's in an ignored channel
        reaction.count < this.client.config.star.starMinimum) { //  If the minimum wasn't reached
      return null;
    }

    reaction.message.guild.channels.find('name', this.client.config.star.starChannel)
      .send(this.client.util.embed()
        .setColor('#FFDC00')
        .setAuthor(reaction.message.author.username, reaction.message.author.avatarURL)
        .setDescription(reaction.message.content));

    reaction.message.guild.stars.push(reaction.message.id);
  }
}

module.exports = StarListener;
