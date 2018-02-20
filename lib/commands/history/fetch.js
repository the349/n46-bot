const { Command } = require('discord-akairo');

class FetchCommand extends Command {
  constructor () {
    super('fetch', {
      aliases: ['fetch'],
      clientPermissions: ['BAN_MEMBERS'],
      args: [{
        id: 'id',
        match: 'prefix',
        type: 'string',
        prefix: 'id='
      }, {
        id: 'involves',
        match: 'prefix',
        type: 'user',
        prefix: 'involves='
      }, {
        id: 'type',
        match: 'prefix',
        type: 'string',
        prefix: 'type='
      }]
    });
  }

  static resolve (guild, { involves, type }) {
    return Object.keys(guild.history).reduce((logs, entry) => {
      entry = guild.history[entry];
      const tests = [];

      if (involves) {
        tests.push((entry.user === involves || entry.mod === involves || entry.for === involves));
      }

      if (type) {
        tests.push((type.toLowerCase() === entry.type.toLowerCase()));
      }

      if ((tests.length > 0 && tests.indexOf(false) === -1)) {
        logs.push(entry);
      }

      return logs;
    }, []);
  }

  async exec (message, { id, involves, type }) {
    let logs = [];

    if (!id) {
      logs = FetchCommand.resolve(message.guild, { involves: involves.id, type });
    } else {
      logs = [message.guild.history[id]];
    }

    if (logs.length === 0 || !logs[0]) {
      return message.reply('I can\'t find any matches in my history.');
    } else if (logs.length === 1) {
      logs = logs[0];
      return message.channel
        .send(this.client.util.embed()
          .addField(logs.type, await this.client.fetchUser(logs.user))
          .addField('Mod', await this.client.fetchUser(logs.mod))
          .addField('Reason', logs.reason)
          .setFooter(logs.shortId));
    } else {
      this.client.util.chunkArrayInGroups(logs, 5).forEach((logs, index) => {
        const embed = logs.reduce((embed, entry) => {
          return embed
            .addField(`\`\`\`${new Date(entry.time).toUTCString().split(' ').splice(1, 4).join(' ')}\`\`\``,
              `${entry.type} (id: \`${entry.shortId}\`): ${entry.reason}`);
        }, this.client.util.embed());

        setTimeout(() => {
          message.channel.send(embed);
        }, index * 1000);
      });
    }
  }
}

module.exports = FetchCommand;
