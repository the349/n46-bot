const { Command } = require('discord-akairo');

// Tested and works: 2018-02-21
// No edits since

class GreetCommand extends Command {
  constructor () {
    super('greet', {
      aliases: ['approve', 'greet'],
      clientPermissions: ['MANAGE_ROLES'],
      args: [{
        id: 'member',
        type: 'member'
      }]
    });
  }

  userPermissions (message) {
    const perms = message.guild.config.permissions.GREET_MEMBER.map((role) => {
      return message.member.roles.exists('name', role);
    });
    return perms.indexOf(true) > -1;
  }

  exec (message, args) {
    if (!message.guild.config.greeting.on) return;

    // Give the newcomer the right role
    args.member.addRole(message.guild.roles.find('name', message.member.guild.config.greeting.newMemberRole));

    // Tell the greeter it worked
    message.member.guild.channels.find('name', message.member.guild.config.greeting.greeterTalkChannel)
      .send(this.client.util.embed()
        .setColor('#2ECC40')
        .setAuthor(args.member.displayName, args.member.user.avatarURL)
        .addField('User Has Been Greeted', 'Remember to welcome them and tell them about #faq'));

    return message.react('✅');
  }
}

module.exports = GreetCommand;
