const { MessageEmbed } = require('discord.js')

module.exports = {
  conf: {
    aliases: ["y", "h"],
    name: "help",
  },

  /**
   * @param { Client } client
   * @param { Message } message
   * @param { Array<String> } args
   */

  run: async (client, message, args, embed, prefix) => {
    const msgembed = new MessageEmbed()
    msgembed.setAuthor('KingZ')
    msgembed.setTitle('All Commands')
    msgembed.setDescription(client.commands.filter((x) => x.conf.help).sort((a, b) => b.conf.help - a.conf.help).map((x) => `\`${prefix}${x.conf.help}\``).join("\n"))
    message.channel.send({embeds: [msgembed]});
  },
};
