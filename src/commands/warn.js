const conf = require("../configs/config.json");
const { MessageEmbed } = require("discord.js");
const moment = require("moment");
moment.locale("tr");

module.exports = {
  conf: {
    aliases: ["uyar","uyarı"],
    name: "warn",
    help: "warn [user] [reason]",
  },

  /**
   * @param { Client } client
   * @param { Message } message
   * @param { Array<String> } args
   */

  run: async (client, message, args, embed) => {
    if (!message.member.hasPermission(8) && !conf.penals.warn.staffs.some(x => message.member.roles.cache.has(x))) return message.channel.error(message, "Not enough Permission!");
    const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
    if (!member) return message.channel.error(message, "Specify a member!");
    const reason = args.slice(1).join(" ") || "Unspecified";
    if (!message.member.hasPermission(8) && member.roles.highest.position >= message.member.roles.highest.position) return message.channel.error(message, "You can't warn someone that have the same or higher role than you!");

    const penal = await client.penalize(message.guild.id, member.user.id, "WARN", false, message.author.id, reason);
    message.channel.send(`Member ${member.toString()} has been warned by ${message.author} due to their action of \`${reason}\`! \`(Case ID: #${penal.id})\``);
    if (conf.dmMessages) member.send(`You have been warned at **${message.guild.name}** by **${message.author.tag}** due to your action of **${reason}**!`).catch(() => {});
    
    const log = new MessageEmbed()
      .setAuthor(member.user.username, member.user.avatarURL({ dynamic: true, size: 2048 }))
      .setColor("RED")
      .setTitle("Member Warned")
      .setDescription(`
${member.toString()} has been warned!

Case ID: \`#${penal.id}\`
Warned member: ${member.toString()} \`(${member.user.username.replace(/\`/g, "")} - ${member.user.id})\`
Warned by: ${message.author} \`(${message.author.username.replace(/\`/g, "")} - ${message.author.id})\`
Warned at: \`${moment(Date.now()).format("LLL")}\`
Warn reason: \`${reason}\`
      `);
    message.guild.channels.cache.get(conf.penals.warn.log).send(log);
  },
};
