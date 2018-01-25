const Akairo = require('discord-akairo');
const logger = require('../logger');

class LeaveListener extends Akairo.Listener {

  constructor() {
    super('guildMemberRemove', {
      eventName: 'guildMemberRemove',
      emmiter: 'client'
    });
  }

  exec(member) {
    const greeters = member.guild.channels.find('name', 'greeters');
    const intro = member.guild.channels.find('name', 'introduction');

    const leaveEmbed = this.client.util.embed()
      .setAuthor(member.displayName, member.user.avatarURL)
      .setColor('#FF4136')
      .addField('User Has Left', 'User has left of their own accord.')

    greeters.send(leaveEmbed);
    intro.send(leaveEmbed);
  }

}

module.exports = LeaveListener;
