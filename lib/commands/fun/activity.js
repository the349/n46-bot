const { Command } = require('../../bot');
const { Collection } = require('discord.js');

class ActivityCommand extends Command {
  constructor () {
    super('activity', {
      aliases: ['activity'],
      channelRestriction: 'guild',
      args: [{
        id: 'channel',
        type: 'channel',
        default: msg => msg.channel
      }]
    });
  }

  async fetchMessages (channel, reply, messages) {
    let before = messages.last() || { id: null };
    before = before.id;
    const chunk = await channel.fetchMessages({ limit: 100, before });
    messages = messages.concat(chunk);
    if (chunk.size === 100 && messages.size < 3000) {
      return this.fetchMessages(channel, reply, messages);
    }
    return messages;
  }

  async exec (message, { channel }) {
    const reply = await message.channel.send('I’m gathering data...');
    const messages = await this.fetchMessages(channel, reply, new Collection());
    let authors = messages.reduce((authors, message) => {
      if (message.guild.members.has(message.author.id) && !message.author.bot) {
        const count = authors.get(message.author.id) || 0;
        authors.set(message.author.id, count + 1);
      }
      return authors;
    }, new Collection());

    const authorsArray = Array(...authors.entries()).sort((a, b) => {
      return (b[1] > a[1]);
    }).slice(0, 10);

    const embed = this.client.util.embed();
    const description = authorsArray.reduce((desc, author) => {
      return desc + `${Math.floor(100 * author[1] / messages.size)}% : ` +
      this.client.util.resolveMember(author[0], message.guild.members).user.username + '\n';
    }, '```yaml\n') + '```';

    embed.setDescription(description);
    embed.setTitle(`Analysis: Last ${messages.size} Messages in #${channel.name}`);
    return message.channel.send(embed);
  }
}

module.exports = ActivityCommand;
