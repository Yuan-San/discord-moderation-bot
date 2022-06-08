const conf = require("../configs/config.json");
const { MessageEmbed } = require("discord.js");
const moment = require("moment");
moment.locale("tr");

module.exports = {
  conf: {
    aliases: [],
    name: "unban",
    help: "unban [user]",
  },

  /**
   * @param { Client } client
   * @param { Message } message
   * @param { Array<String> } args
   */

  run: async (client, message, args, embed) => {
    if (!message.member.hasPermission("BAN_MEMBERS") && !conf.penals.ban.staffs.some(x => message.member.roles.cache.has(x))) return message.channel.error(message, "Not enough Permission!");
    if (!args[0]) return message.channel.error(message, "SPECIFY AN ID DUMBASS, CAN YOU? PLEASE IM TIRED WITH THIS!");
    if (!args[0].isintenger) return message.channel.error(message, "This is not an ID")
    
    message.channel.send(`Member(${ban.user.username.replace(/\`/g, "")} - ${ban.user.id})\` has been unbanned by ${message.author}!`);
    message.guild.members.unban(args[0])
     .catch (err => {
           if(err) return message.channel.error(message, "Something went wrong...")
     });
    if (conf.dmMessages) ban.user.send(`You have been unbanned at **${message.guild.name}** by **${message.author.tag}**! Invite: ${String(conf.invite)}`).catch(() => {});

    const log = new MessageEmbed()
      .setAuthor(ban.user.username, ban.user.avatarURL({ dynamic: true, size: 2048 }))
      .setTitle("Member Unbanned")
      .setColor("GREEN")
      .setDescription(`
\`(${ban.user.username.replace(/\`/g, "")} - ${ban.user.id})\` has been unbanned!

Unbanned by: ${message.author} \`(${message.author.username.replace(/\`/g, "")} - ${message.author.id})\`
Unbanned at: \`${moment(Date.now()).format("LLL")}\`
      `)
    message.guild.channels.cache.get(conf.penals.ban.log).send(log);
  },
};
