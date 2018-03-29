const { Command } = require('../../bot');

// Tested and works: 2018-02-21
// No edits since

class UnmuteCommand extends Command {
  constructor () {
    super('unmute', {
      aliases: ['unmute'],
      clientPermissions: ['MANAGE_ROLES'],
      userPermissions: ['MANAGE_MESSAGES', 'MANAGE_ROLES'],
      botPermissions: ['MUTE_USER'],
      args: [{
        id: 'server',
        match: 'flag',
        prefix: 'server'
      }, {
        id: 'generals',
        match: 'flag',
        prefix: 'generals'
      }, {
        id: 'scope',
        type: 'channels',
        match: 'content',
        default: msg => [msg.channel]
      }, {
        id: 'member',
        type: 'member',
        match: 'content'
      }, {
        id: 'memberID',
        type: 'string',
        match: 'content'
      }]
    });
  }

  static unmute (client, { server, generals, ids: { author, channel, scope, guild, member } }) {
    // Resolve the IDs
    guild = client.guilds.get(guild);
    scope = scope.map(id => guild.channels.get(id));
    channel = guild.channels.get(channel);
    member = guild.members.get(member);
    author = guild.members.get(author);

    if (!member) return;

    if (server) {
      scope = guild.channels.filter(g => g.type === 'text');
    } else if (generals) {
      scope = guild.config.mutegroups.generals.map((channel) => {
        return guild.channels.find('name', channel);
      });
    }

    scope.forEach(channel => {
      var perms = channel.permissionOverwrites.get(member.id);
      if (perms && client.util.resolvePermissionNumber(perms.deny).includes('SEND_MESSAGES')) {
        if (perms.allow === 0 && (perms.deny === 2048 || perms.deny !== 2112)) {
          perms.delete();
        } else {
          channel.overwritePermissions(member, { 'SEND_MESSAGES': null, 'ADD_REACTIONS': null });
        }
      }
    });

    const embed = client.util.embed()
      .setColor('#2ECC40')
      .setAuthor(author.user.username, author.user.avatarURL)
      .setDescription(`${member.displayName} unmuted`)

    // Hotfix, look oskyr if you want configurability
    const staffChat = guild.channels.find('name', 'staff-chat');

    staffChat.send(embed);
    return channel.send(embed);
  }

  async exec (message, { server, generals, scope, member, memberID, milliseconds, seconds, minutes, hours, days }) {
    if (memberID) {
      memberID = memberID.split(/\s+/).reduce((memberID, chunk) => {
        return /\d{17,19}/.test(chunk) ? chunk : memberID;
      });

      if (memberID && !memberID.startsWith('<')) {
        member = await message.guild.fetchMember(memberID);
      }
    }

    if (message.member.highestRole.calculatedPosition <= member.highestRole.calculatedPosition) {
      return this.client.commandHandler.emit('commandBlocked', message, this, 'userPermissions');
    }

    // Get sum of times and see if any are used
    return UnmuteCommand.unmute(this.client, {
      generals,
      server,
      ids: {
        author: message.author.id,
        channel: message.channel.id,
        scope: scope.map(channel => channel.id),
        guild: message.guild.id,
        member: member.id
      }
    });
  }
}

module.exports = UnmuteCommand;
