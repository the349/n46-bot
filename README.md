# N46 Bot

A discord bot

## How it Works

To run the bot use `nodejs . <ownerID> <token>`

## Commands

This bot is for an specific server, which explains some of the more specific features.

### User Management

## Moderator Actions

### Ban

The `!ban <user>` command bans `<user>`

Only users that the bot can ban will be banned by this command (duh). In addition to this, if the user running the `!ban` command does not have ban permissions, the command will fail. Lastly, if the user can ban other users but not the user they specified (attempting to ban a user higher than them), the command will fail regardless of the bot’s ability to ban the user.

### Kick

The `!kick <user>` command kicks `<user>` and requires the same permission system as ban (but with KICK_MEMBERS of course).

### Greet

The `!greet <user>` command, which can also be triggered by `!approve` "greets" a user by giving them the `Newcomers` role. This command only works if the user who triggers it has the `Greeter` role and the bot has the `MANAGE_ROLES` permission.

It responds with a short message confirming that the user has been greeted.

## Role Management

ALL of these commands need the `MANAGE_ROLES` permission

### Updating Roles

To make groups of roles like "Colors" you must make a header role that has the syntax `:Rolegroup Name:` If you'd like the role group to be exclusive (a member can only have one of the roles at a time), you must use the format `e:Rolegroup Name:`. If you'd like that rolegroup to not have its roles given out at all, it must start with 'x.' Every role after that header and before another is considered part of that role group. Any time changes are made to roles it’s best to run `!updateroles` to update the bot’s memory of givable roles.

### Adding/Removing Roles

To add a role to yourself or remove an existing one, use `!role <rolename>...`. If you already have a role in that role group, the new one will replace the old one. You cannot add or remove roles that aren't registered

## General Nonsense

### TFW

The `!tfw` command describes the plight of single males-who-like-males by displaying a message in the form of a reaction sequence. The sequence loads slowly, and it seems to load the emojis in groups of three. Because of this, users could probably inject emojis into the middle of the message.

Since this command is of low importance and uses a fair amount of resources, it has a cool-down attached to it, telling users who use it more than twice in ten seconds to cool down by reacting with `:cool:` and `:arrow_down:`
