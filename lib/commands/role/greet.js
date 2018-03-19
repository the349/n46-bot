const { Command } = require('../../bot');

class GreetCommand extends Command {
  constructor () {
    super('greet', {
      aliases: ['approve', 'greet'],
      clientPermissions: ['MANAGE_ROLES'],
      botPermissions: ['GREET_MEMBER'],
      args: [{
        id: 'member',
        type: 'member'
      }]
    });
  }

  async exec (message, { member }) {
    if (!message.guild.config.greeting.on) return;

    // Give the newcomer the right role
    member.addRole(message.guild.roles.find('name', message.member.guild.config.greeting.newMemberRole));

    // Tell the greeter it worked
    message.member.guild.channels.find('name', message.member.guild.config.greeting.greeterTalkChannel)
      .send(this.client.util.embed()
        .setColor('#2ECC40')
        .setAuthor(member.displayName, member.user.avatarURL)
        .addField('User Has Been Greeted', 'Remember to welcome them and tell them about #faq'));

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
