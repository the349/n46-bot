const { Command } = require('../../bot');

class GreetCommand extends Command {
  constructor () {
    super('greet', {
      aliases: ['approve', 'greet'],
      clientPermissions: ['MANAGE_ROLES'],
      botPermissions: ['GREET_MEMBER'],
      channelRestriction: 'guild',
      args: [{
        id: 'memberID',
        type: 'dynamicInt',
        match: 'content'
      }]
    });
  }

  async exec (message, { memberID }) {
    if (!message.guild.config.greeting.on) return;

    if (!memberID) {
      return message.reply('I could not find that ungreeted member, ask a mod for help');
    }

    const ungreetedUsers = message.guild.members.filter(member => member.roles.size === 1);
    const member = this.client.util.resolveMember(memberID, ungreetedUsers);

    if (!member) {
      return message.reply('I could not find that ungreeted member, ask a mod for help');
    }

    // Give the newcomer the right role
    member.addRole(message.guild.roles.find('name', message.member.guild.config.greeting.newMemberRole));

    if (message.guild.joins.has(member.id)) {
      let { sent, embed } = message.guild.joins.get(member.id);
      sent = await sent;
      sent.edit(embed.setFooter(`Greeted by ${message.member.user.tag}`));
      message.guild.joins.delete(message.member.id);
    }

    return message.react('✅');
  }
}

module.exports = GreetCommand;
