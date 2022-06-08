module.exports = {
  conf: {
    aliases: ["lock"],
    name: "lock",
    help: "lock",
  },

  /**
   * @param { Client } client
   * @param { Message } message
   * @param { Array<String> } args
   */

  run: async (client, message, args, embed) => {
    if (!message.member.hasPermission("MANAGE_CHANNELS")) return;
    if (message.channel.permissionsFor(message.guild.roles.everyone).has("SEND_MESSAGES")) {
      message.channel.updateOverwrite(message.guild.roles.everyone, {
        SEND_MESSAGES: false,
      });
      message.channel.send("Channel locked!");
    } else {
      message.channel.updateOverwrite(message.guild.roles.everyone, {
        SEND_MESSAGES: null,
      });
      message.channel.send("Channel unlocked!");
    }
  },
};
