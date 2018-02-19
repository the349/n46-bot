const { Command } = require('discord-akairo');

class FetchCommand extends Command {
  constructor () {
    super('fetch', {
      aliases: ['fetch'],
      clientPermissions: ['BAN_MEMBERS'],
      args: [{
        id: 'id',
        match: 'prefix',
        prefix: 'id='
      }]
    });
  }

  async exec (message, { id }) {
    const starts = {
      u: 'unbans',
      b: 'bans'
    };

    const list = Object.keys(starts).reduce((list, start) => {
      if (id.startsWith(start)) {
        return message.guild.history[starts[start]];
      } else {
        return false;
      }
    });

    if (!list || !list.hasOwnProperty(id)) {
      return message.reply('I found no such action in my logs');
    }

    message.channel
      .send(this.client.util.embed()
        .setColor('#FF4136')
        .addField(list[id].type, await this.client.fetchUser(list[id].user))
        .addField('Mod', await this.client.fetchUser(list[id].mod))
        .addField('Reason', list[id].reason)
        .setFooter(`ACTION ID: ${id}`));
  }
}

module.exports = FetchCommand;
