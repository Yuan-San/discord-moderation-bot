const { emojis } = require("../configs/config.json");

module.exports = {
  conf: {
    aliases: ["sil", "clear"],
    name: "purge",
    help: "purge [amount]",
  },

  /**
   * @param { Client } client
   * @param { Message } message
   * @param { Array<String> } args
   */

  run: async (client, message, args, embed) => {
    if (!message.member.hasPermission('MANAGE_MESSAGES')) return;
    if (!args[0]) return message.channel.error(message, "You have to specify an amount!");
    if (isNaN(args[0])) return message.channel.error(message, "The amount you specify must be a number!");
    await message.delete();
    await message.channel.bulkDelete(args[0]);
    message.channel.send(embed.setDescription(`${emojis.mark} ${args[0]} message has been deleted!`));
  },
};
