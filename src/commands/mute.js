const conf = require("../configs/config.json");
const { MessageEmbed } = require("discord.js");
const moment = require("moment");
const muteLimit = new Map();
moment.locale("tr");
const ms = require("ms");

module.exports = {
  conf: {
    aliases: ["mute", "sustur", "cmute", "chat-mute"],
    name: "chatmute",
    help: "chatmute [user] [duration] [reason]",
  },

  /**
   * @param { Client } client
   * @param { Message } message
   * @param { Array<String> } args
   */

  run: async (client, message, args, embed) => {
    if (!message.member.hasPermission(8) && !conf.penals.chatMute.staffs.some(x => message.member.roles.cache.has(x))) return message.channel.error(message, "Not enough Permission!");
    const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
    if (!member) return message.channel.error(message, "You must specify a member!");
    if (conf.penals.chatMute.roles.some(x => member.roles.cache.has(x))) return message.channel.error(message, "This member is already chat muted!");
    const duration = args[1] ? ms(args[1]) : undefined;
    if (!duration) return message.channel.error(message, `You must specify mute duration!`);
    const reason = args.slice(2).join(" ") || "Unspecified";
    if (!message.member.hasPermission(8) && member.roles.highest.position >= message.member.roles.highest.position) return message.channel.error(message, "You cannot chat mute someone with the same or higher role as you!");
    if (!member.manageable) return message.channel.error(message, "I can't mute this member!");
    if (conf.penals.chatMute.limit > 0 && muteLimit.has(message.author.id) && muteLimit.get(message.author.id) == conf.penals.chatMute.limit) return message.channel.error(message, "You've reached your hourly mute limit!");

    member.roles.add(conf.penals.chatMute.roles);
    const penal = await client.penalize(message.guild.id, member.user.id, "CHAT-MUTE", true, message.author.id, reason, true, Date.now() + duration);
    const time = ms(duration).replace("h", " hour(s)").replace("m", " minute(s)").replace("s", " second(s)");
    message.channel.send(`${member.toString()} has been chat muted by ${message.author} because of \`${reason}\` for **${time}**! \`(Case ID: #${penal.id})\``);
    if (conf.dmMessages) member.send(`You have been chat muted at**${message.guild.name}** by **${message.author.tag}** because of **${reason}** for **${time}**!`).catch(() => {});

    const log = new MessageEmbed()
      .setAuthor(member.user.username, member.user.avatarURL({ dynamic: true, size: 2048 }))
      .setColor("RED")
      .setTitle("Member Chatmuted")
      .setDescription(`
${member.toString()} has been Chatmuted for \`${time}\` long!

Case ID: \`#${penal.id}\`
Member Chatmuted: ${member.toString()} \`(${member.user.username.replace(/\`/g, "")} - ${member.user.id})\`
Chatmuted by: ${message.author} \`(${message.author.username.replace(/\`/g, "")} - ${message.author.id})\`
Chatmuted at: \`${moment(Date.now()).format("LLL")}\`
Chatmute End Date: \`${moment(Date.now() + duration).format("LLL")}\`
Chatmute reason: \`${reason}\`
      `);
    message.guild.channels.cache.get(conf.penals.chatMute.log).send(log);

    if (conf.penals.chatMute.limit > 0) {
      if (!muteLimit.has(message.author.id)) muteLimit.set(message.author.id, 1);
      else muteLimit.set(message.author.id, muteLimit.get(message.author.id) + 1);
      setTimeout(() => {
        if (muteLimit.has(message.author.id)) muteLimit.delete(message.author.id);
      }, 1000 * 60 * 60);
    }
  },
};
