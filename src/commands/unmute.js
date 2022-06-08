const conf = require("../configs/config.json");
const { MessageEmbed } = require("discord.js");
const moment = require("moment");
moment.locale("tr");

module.exports = {
  conf: {
    aliases: ["unmute"],
    name: "unchatmute",
    help: "unchatmute [user]",
  },

  /**
   * @param { Client } client
   * @param { Message } message
   * @param { Array<String> } args
   */

  run: async (client, message, args, embed) => {
    if (!message.member.hasPermission(8) && !conf.penals.chatMute.staffs.some(x => message.member.roles.cache.has(x))) return message.channel.error(message, "Not enough permission!");
    const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
    if (!member) return message.channel.error(message, "Specify a member, please!");
    if (!conf.penals.chatMute.roles.some(x => member.roles.cache.has(x))) return message.channel.error(message, "This member is not chatmuted!");
    if (!message.member.hasPermission(8) && member.roles.highest.position >= message.member.roles.highest.position) return message.channel.error(message, "You can't unmute someone that have the same or higher role than you!");
    if (!member.manageable) return message.channel.error(message, "I can't unmute this member!");

    member.roles.remove(conf.penals.chatMute.roles);
    message.channel.send(`Member ${member.toString()} has been un chatmuted by ${message.author}!`);
    if (conf.dmMessages) member.send(`You have been unchatmuted at **${message.guild.name}** by **${message.author.tag}**!`).catch(() => {});

    const log = new MessageEmbed()
      .setAuthor(member.user.username, member.user.avatarURL({ dynamic: true, size: 2048 }))
      .setColor("GREEN")
      .setTitle("Member un chatmuted!")
      .setDescription(`
${member.toString()} has been un chatmuted!

Unmuted Member: ${member.toString()} \`(${member.user.username.replace(/\`/g, "")} - ${member.user.id})\`
Unmuted by: ${message.author} \`(${message.author.username.replace(/\`/g, "")} - ${message.author.id})\`
Unmuted at: \`${moment(Date.now()).format("LLL")}\`
      `);
    message.guild.channels.cache.get(conf.penals.chatMute.log).send(log);
  },
};
