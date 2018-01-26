# N46 Bot

A discord bot

## How it Works

To run the bot use `nodejs . <ownerID> <token>`

## Commands

This bot is for an specific server, which explains some of the more specific features.

### User Management

### Greet

The `!greet <user>` command, which can also be triggered by `!approve` "greets" a user by giving them the `Newcomers` role. This command only works if the user who triggers it has the `Greeter` role and the bot has the `MANAGE_ROLES` permission.

It responds with a short message confirming that the user has been greeted.

## Role Management

ALL of these commands need the `MANAGE_ROLES` permission

### Registering Roles

Before users can request a role, an admin needs to register them in the bot's database with a group attached to them. To do so the admin can kindly use the `!mkrole <groupname> <exclusive?> <rolename>...` where you may list role names as many times as you'd like. `<exclusive?>` can either be yes or no, and if yes it will disallow people from having multiple roles in that group. In `<rolename>` you cannot use spaces, but underscores will be replaced with spaces so no worries!

Using `!mkrole` on an existing group will just add to that group.

`!mkrole` CANNOT be used before the role has been created.

If you need to deregister a role: `!rmrole <rolename>` (notice that role names cannot be used from group to group).

### Adding/Removing Roles

To add a role to yourself or remove an existing one, use `!role <rolename>...`. If you already have a role in that role group, the new one will replace the old one. You cannot add or remove roles that aren't registered

## General Nonsense

### TFW

The `!tfw` command describes the plight of single males-who-like-males by displaying a message in the form of a reaction sequence. The sequence loads slowly, and it seems to load the emojis in groups of three. Because of this, users could probably inject emojis into the middle of the message.

Since this command is of low importance and uses a fair amount of resources, it has a cool-down attached to it, telling users who use it more than twice in ten seconds to cool down by reacting with `:cool:` and `:arrow_down:`
