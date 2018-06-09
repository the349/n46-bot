const { Listener } = require('discord-akairo');
const UI = require('../../util/UI');
const moment = require('moment');

class LeaveListener extends Listener {
  constructor () {
    super('greeting.leave', {
      eventName: 'guildMemberRemove',
      emmiter: 'client',
      category: 'greeting'
    });
  }

  exec (member) {
    if (!this.client.configDB.get('greeting', 'enabled', true)) return;

    const leaveEmbed = this.client.util.embed()
      .setAuthor(member.displayName, member.user.avatarURL)
      .setColor('#FF851B')
      .setTitle('User Has Left')
      .setDescription(UI.objectToCodeblock({
        'Joined': moment().utc().fromNow(),
        'ID': member.id
      }));

    let introChannel = this.client.configDB.get('greeting', 'intro-channel', 'introduction');
    let greeterChannel = this.client.configDB.get('greeting', 'greeter-channel', 'greeters');
    introChannel = member.guild.channels.find('name', introChannel);
    greeterChannel = member.guild.channels.find('name', greeterChannel);

    introChannel.send(leaveEmbed);
    greeterChannel.send(leaveEmbed);
  }
}

module.exports = LeaveListener;
