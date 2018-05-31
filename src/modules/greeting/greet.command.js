const { Command } = require('discord-akairo');

class GreetCommand extends Command {
  constructor () {
    super('greeting.greet', {
      aliases: ['approve', 'greet'],
      clientPermissions: ['MANAGE_ROLES'],
      channelRestriction: 'guild',
      category: 'greeting',
      args: [{
        id: 'memberID',
        type: 'dynamicInt',
        match: 'content'
      }]
    });
  }

  userPermissions (message) {
    const greeterRole = this.client.configDB.get('greeting', 'greeter-role', 'Greeter');
    return message.member.roles.exists(role => role.name === greeterRole);
  }

  async exec (message, { memberID }) {
    if (!memberID) {
      return message.reply('I could not find that ungreeted member, ask a mod for help');
    }

    const ungreetedUsers = message.guild.members.filter(member => member.roles.size === 1);
    const member = this.client.util.resolveMember(memberID, ungreetedUsers);

    if (!member) {
      return message.reply('I could not find that ungreeted member, ask a mod for help');
    }

    // Give the newcomer the right role
    member.addRole(message.guild.roles.find('name',
      this.client.configDB.get('greeting', 'newcomer-role', 'Newcomers')));

    if (this.client.tempDB.has('ungreetedMembers', member.id)) {
      const { greeterMessage, greeterEmbed } = this.client.tempDB.get('ungreetedMembers', member.id);
      greeterMessage.edit(greeterEmbed.setFooter(`Greeted by ${message.member.user.tag}`));

      this.client.tempDB.delete('ungreetedMembers', member.id);
    }

    return message.react('✅');
  }
}

module.exports = GreetCommand;
