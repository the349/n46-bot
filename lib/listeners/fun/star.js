const { Listener } = require('discord-akairo');

class StarListener extends Listener {
  constructor () {
    super('messageReactionAdd', {
      eventName: 'messageReactionAdd',
      emmiter: 'client'
    });
  }

  async exec ({ message, emoji, count }) {
    // Don't count
    if (!message.guild.config.star.on || // If stars are turned off
        emoji.name !== '⭐' || // If the reation wasn't a star
        message.author.bot || // If it was a bot message
        message.guild.config.star.ignore.indexOf(message.channel.name) > -1 || // If channel is ignored
        count < message.guild.config.star.starMinimum) { //  If the minimum wasn't reached
      return null;
    }

    // If its been posted already
    if (message.guild.stars.has(message.id)) {
      let { sent, embed } = message.guild.stars.get(message.id);
      sent = await sent;
      const current = parseInt(embed.footer.text.split(' ')[0]);
      sent.edit(embed.setFooter(`${current < count ? count : current} Stars in #${message.channel.name}`));
      return;
    }

    let embed = this.client.util.embed()
      .setColor('#FFDC00')
      .setAuthor(message.author.username, message.author.avatarURL)
      .setDescription(message.content)
      .setFooter(`${count} Stars in #${message.channel.name}`);

    embed = message.attachments.reduce((embed, attachment) => {
      return embed.attachFile(attachment.url);
    }, embed);

    const sent = message.guild.channels.find('name', message.guild.config.star.starChannel)
      .send(embed);
    message.guild.stars.set(message.id, { sent, embed });
  }
}

module.exports = StarListener;
