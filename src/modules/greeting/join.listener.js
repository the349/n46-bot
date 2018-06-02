const { Listener } = require('discord-akairo');
const UI = require('../../util/UI');
const moment = require('moment');

const longGreetMessage =
  'Please introduce yourself to a greeter with your age, country, sexuality, and preferred pronouns. Be polite and patient with the person that greets you.';

class JoinListener extends Listener {
  constructor () {
    super('greeting.join', {
      eventName: 'guildMemberAdd',
      emmiter: 'client',
      category: 'greeting'
    });
  }

  /**
   * Calculates if a user is new to dicsord
   * @param  {GuildMember} member user to check for
   * @return {boolean} if the user is new or not
   */
  userTimeCalculator (member) {
    const issueWarning = this.client.configDB.get('greeting', 'new-user-warning', true);
    const timeLimit = this.client.configDB.get('greeting', 'new-user-age', 604800000); // = 1 week
    const age = new Date().getTime() - member.user.createdAt.getTime();

    return (issueWarning && age < timeLimit);
  }

  /**
   * Creates the embed for the intro join message
   * @param  {GuildMember} member New member
   * @return {RichEmbed} Embed to use
   */
  createIntroEmbed (member) {
    const welcomeMsg = this.client.configDB.get('greeting', 'welcome-msg', longGreetMessage);

    return this.client.util.embed()
      .setColor('#2ECC40')
      .setTitle(`Welcome to ${member.guild.name}`)
      .setDescription(welcomeMsg)
      .setThumbnail(member.user.avatarURL);
  }

  /**
   * Creates the embed for the greeters join message
   * @param  {GuildMember} member New member
   * @return {RichEmbed} Embed to use
   */
  createGreeterEmbed (member) {
    const desc = UI.objectToCodeblock({
      'Join': moment().utc().format('HH:mm:ss [UTC]'),
      'Created': moment(member.user.createdAt).utc().format('D MMMM YYYY [UTC]'),
      'ID': member.id
    });

    return this.client.util.embed()
      .setColor('#2ECC40')
      .setDescription(`${member}\n${desc}`)
      .setThumbnail(member.user.avatarURL);
  }

  /**
   * Sends notifications to intro and greeter channels
   * @param  {[type]} member New member
   * @return {Promise} Returns the greeter channels message object for editing
   */

  async sendMessages (member) {
    const newUser = this.userTimeCalculator(this.client, member);
    const introEmbed = this.createIntroEmbed(member);
    const greeterEmbed = this.createGreeterEmbed(member);

    let introChannel = this.client.configDB.get('greeting', 'intro-channel', 'introduction');
    let greeterChannel = this.client.configDB.get('greeting', 'greeter-channel', 'greeters');

    introChannel = member.guild.channels.find('name', introChannel);
    greeterChannel = member.guild.channels.find('name', greeterChannel);

    introChannel.send(introEmbed);

    if (newUser) {
      greeterEmbed.setFooter('!!! This User Is New to Discord !!!');
    }

    const greeterMessage = await greeterChannel.send(greeterEmbed);

    return { greeterMessage, greeterEmbed };
  }

  async exec (member) {
    if (!this.client.configDB.get('greeting', 'enabled', true)) return;

    const greeterMessageAndEmbed = await this.sendMessages(member);

    this.client.tempDB.set('ungreetedMembers', member.id, greeterMessageAndEmbed);
  }
}

module.exports = JoinListener;
