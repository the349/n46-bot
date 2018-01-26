# N46 Bot

A discord bot

## How it Works

To run the bot use `nodejs . <ownerID> <token>`

## Commands

This bot is for an specific server, which explains some of the more specific features.

### Greet

The `!greet <user>` command, which can also be triggered by `!approve` "greets" a user by giving them the `Newcomers` role. This command only works if the user who triggers it has the `Greeter` role and the bot has the `MANAGE_ROLES` permission.

It responds with a short message confirming that the user has been greeted.

### TFW

The `!tfw` command describes the plight of single males-who-like-males by displaying a message in the form of a reaction sequence. The sequence loads slowly, and it seems to load the emojis in groups of three. Because of this, users could probably inject emojis into the middle of the message.

Since this command is of low importance and uses a fair amount of resources, it has a cool-down attached to it, telling users who use it more than twice in ten seconds to cool down by reacting with `:cool:` and `:arrow_down:`
