# Guidelines

If you want to contribute or already are a contributor, this is a very valuable read.

## Code Style

This project uses the  [semistandard](https://github.com/feross/standard) style. Please make sure to follow it!

## Bot-User Interaction

Reactions between bots and users should:  

-   Use RichEmbeds to introduce a new topic

    -   The color should match the situation. Green for good messages, yellow for messages requiring responses, orange for neutral messages, and red for negative messages.
    -   If the message describes a user's actions (like joining, leaving), it should use that user as the author

-   Favor emoji reacts to the user's message instead of full messages to avoid cluttering the channel.
    -   If there are already reactions on the user's message, use a full message response to provide clarity. If there is too much to say for reacts, use a full message. Remember to use RichEmbeds
-   Use a polite tone but the bot should never address itself with _I_, _me_, or _my_, but instead use _you_ or _your_ after pinging the user.
-   When using emojis always make sure the meaning is clear in both the `:code:` and picture form.

Unless otherwise stated, all interactions should follow the [Material Design Writing Guidelines](https://material.io/guidelines/style/writing.html).

The main purpose of these rules for interaction is to avoid cluttering a channel with bot messages. In many servers their are bots that are heavily used and I believe this reduces actual user-user interaction, so this bot is made to only aid in promoting a healthy active server.
