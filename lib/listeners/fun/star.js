const { Listener } = require('discord-akairo');

class StarListener extends Listener {
  constructor () {
    super('messageReactionAdd', {
      eventName: 'messageReactionAdd',
      emmiter: 'client'
    });
  }

  async exec (reaction) {
    // Don't count
    if (!reaction.message.guild.config.star.on || // If stars are turned off
        reaction.emoji.name !== '⭐' || // If the reation wasn't a star
        reaction.message.author.bot || // If it was a bot message
        reaction.count < reaction.message.guild.config.star.starMinimum) { //  If the minimum wasn't reached
      return null;
    }

    // If its been posted already
    if (reaction.message.guild.stars.has(reaction.message.id)) {
      let { sent, embed } = reaction.message.guild.stars.get(reaction.message.id);
      sent = await sent;
      sent.edit(embed.setFooter(`${reaction.count} Stars`));
      return;
    }

    let embed = this.client.util.embed()
      .setColor('#FFDC00')
      .setAuthor(reaction.message.author.username, reaction.message.author.avatarURL)
      .setDescription(reaction.message.content)
      .setFooter(`${reaction.count} Stars`);

    embed = reaction.message.attachments.reduce((embed, attachment) => {
      return embed.attachFile(attachment.url);
    }, embed);

    const sent = reaction.message.guild.channels.find('name', reaction.message.guild.config.star.starChannel)
      .send(embed);
    reaction.message.guild.stars.set(reaction.message.id, { sent, embed });
  }
}

module.exports = StarListener;
