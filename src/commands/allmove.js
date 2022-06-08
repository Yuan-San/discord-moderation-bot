const { MessageEmbed } = require('discord.js');
module.exports = {
  conf: {
    aliases: [],
    name: "allmove",
    help: "allmove [channel id]",
  },

  /**
   * @param { Client } client
   * @param { Message } message
   * @param { Array<String> } args
   */

  run: async (client, message, args, embed) => {
    if (!message.member.hasPermission("MOVE_MEMBERS")) return;
    if (!args[0])  message.channel.error(message, "You must enter a channel ID to which members will be moved!");
    if (message.member.voice.channelID) {
      const channel = message.member.voice.channel;
      channel.members.forEach((x, index) => {
        client.wait(index * 1000);
        x.voice.setChannel(args[0]);
      });

      message.channel.send('Moved all channel members into' + channel.name + "!");
    } else {
      const channel = message.guild.channels.cache.get(args[0]);
      channel.members.forEach((x, index) => {
        client.wait(index * 1000);
        x.voice.setChannel(args[1]);
      });
      message.channel.send('Moved all channel members into' + channel.name + "!");
    }
  },
};
