const { Collection } = require('discord.js');

class ModMail {
  constructor (client) {
    this.client = client;
    this.threads = new Collection();
    this.guild = this.client.guilds.array()[0];
    this.archiveCategory = this.guild.channels.get(this.guild.config.modmail.archive);
    this.inboxCategory = this.guild.channels.get(this.guild.config.modmail.inbox);
    this.inboxNotif = this.inboxCategory.children.find('name', 'inbox-notifications');
  }

  async start (message) {
    const thread = {
      user: message.author
    };

    thread.relayChannel = this.guild.channels.find('name', thread.user.id);

    if (!thread.relayChannel) {
      thread.relayChannel = await this.inboxNotif.clone(thread.user.id);
      thread.relayChannel.overwritePermissions(this.guild.roles.find('name', 'Moderator'), {
        VIEW_CHANNEL: true,
        SEND_MESSAGES: true,
        READ_MESSAGE_HISTORY: true
      });

      thread.relayChannel.overwritePermissions(this.guild.roles.find('name', '@everyone'), {
        VIEW_CHANNEL: false
      });
    }

    thread.relayChannel = await thread.relayChannel.setParent(this.inboxCategory);
    thread.relayChannel.send(this.relayMessage(message));

    this.threads.set(message.author.id, thread);
    this.inboxNotif.send(this.client.util.embed()
      .setAuthor(thread.user.username, thread.user.avatarURL)
      .setTitle('Conversation Started')
    );

    thread.user.send('Conversation Started (Your message has been sent)...\n Use !end to end the conversation');
  }

  end (id) {
    const thread = this.threads.get(id);
    this.threads.delete(id);
    thread.relayChannel.setParent(this.archiveCategory);
    this.inboxNotif.send(this.client.util.embed()
      .setAuthor(thread.user.username, thread.user.avatarURL)
      .setTitle('Conversation Ended')
    );

    thread.user.send('Conversation Ended...');
  }

  relayMessage (message) {
    if (!message.guild) return this.relayMessageFromUser(message);
    if (message.guild === this.guild) return this.relayMessageFromMods(message);
  }

  relayMessageFromUser (message) {
    let embed = this.client.util.embed()
      .setAuthor(message.author.tag, message.author.avatarURL)
      .setDescription(message.content);

    embed = message.attachments.reduce((embed, attachment) => {
      return embed.attachFile(attachment.url);
    }, embed);

    return embed;
  }

  relayMessageFromMods (message) {
    let embed = this.client.util.embed()
      .setAuthor('Moderation Team @ ' + this.guild.name, this.guild.iconURL)
      .setDescription(message.content);

    embed = message.attachments.reduce((embed, attachment) => {
      return embed.attachFile(attachment.url);
    }, embed);

    return embed;
  }
}

module.exports = ModMail;
