const conf = require("../configs/config.json");
const { MessageEmbed } = require("discord.js");
const moment = require("moment");
moment.locale("tr");

module.exports = {
  conf: {
    aliases: [],
    name: "unjail",
    help: "unjail [uset]",
  },

  /**
   * @param { Client } client
   * @param { Message } message
   * @param { Array<String> } args
   */

  run: async (client, message, args, embed) => {
    if (!message.member.hasPermission(8) && !conf.penals.jail.staffs.some(x => message.member.roles.cache.has(x))) return message.channel.error(message, "Not enought permission!");
    const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
    if (!member) return message.channel.error(message, "You must specify a member!");
    if (!conf.penals.jail.roles.some(x => member.roles.cache.has(x))) return message.channel.error(message, "This member is not in jail!");
    if (!message.member.hasPermission(8) && member.roles.highest.position >= message.member.roles.highest.position) return message.channel.error(message, "You can't unjail someone with the same or higher role with you!");
    if (!member.manageable) return message.channel.error(message, "I can't get this member out of jail!");

    member.setRoles(conf.registration.unregRoles);
    message.channel.send(`Member ${member.toString()} has been unjailed by  ${message.author}!`);
    if (conf.dmMessages) member.send(`You have been unjailed at **${message.guild.name}** by **${message.author.tag}**!`).catch(() => {});

    const log = new MessageEmbed()
      .setAuthor(member.user.username, member.user.avatarURL({ dynamic: true, size: 2048 }))
      .setColor("GREEN")
      .setTitle("Member Unjailed")
      .setDescription(`
${member.toString()} has been unjailed!

Unjailed Member: ${member.toString()} \`(${member.user.username.replace(/\`/g, "")} - ${member.user.id})\`
Unjailed by: ${message.author} \`(${message.author.username.replace(/\`/g, "")} - ${message.author.id})\`
Unjailed at: \`${moment(Date.now()).format("LLL")}\`
      `)
    message.guild.channels.cache.get(conf.penals.jail.log).send(log);
  },
};
