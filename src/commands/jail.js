const conf = require("../configs/config.json");
const { MessageEmbed } = require("discord.js");
const moment = require("moment");
const jailLimit = new Map();
moment.locale("tr");

module.exports = {
  conf: {
    aliases: ["karantina"],
    name: "jail",
    help: "jail [user] [reason]",
  },

  /**
   * @param { Client } client
   * @param { Message } message
   * @param { Array<String> } args
   */

  run: async (client, message, args, embed) => {
    if (!message.member.hasPermission(8) && !conf.penals.jail.staffs.some(x => message.member.roles.cache.has(x))) return message.channel.error(message, "Not enough Permissions!");
    const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
    if (!member) return message.channel.error(message, "You must specify a member!");
    if (conf.penals.jail.roles.some(x => member.roles.cache.has(x))) return message.channel.error(message, "This member is already in jail!");
    const reason = args.slice(1).join(" ") || "Unspecified";
    if (!message.member.hasPermission(8) && member.roles.highest.position >= message.member.roles.highest.position) return message.channel.error(message, "You cannot jail someone with the same or higher role as you!");
    if (!member.manageable) return message.channel.error(message, "I can't jail this member!");
    if (conf.penals.jail.limit > 0 && jailLimit.has(message.author.id) && jailLimit.get(message.author.id) == conf.penals.jail.limit) return message.channel.error(message, "You've reached your hourly jail limit!");

    member.setRoles(conf.penals.jail.roles);
    const penal = await client.penalize(message.guild.id, member.user.id, "JAIL", true, message.author.id, reason);
    message.channel.send(member.toString() + ' has been jailed by' + message.author + 'because of' + reason + '!`(Case ID: #' + penal.id + '`');
    if (conf.dmMessages) member.send(`You have been jailed at **${message.guild.name}** by **${message.author.tag}** because of **${reason}**!`).catch(() => {});

    const log = new MessageEmbed()
      .setAuthor(member.user.username, member.user.avatarURL({ dynamic: true, size: 2048 }))
      .setColor("RED")
      .setTitle("Member Jailed")
      .setDescription(`
${member.toString()} has been jailed!

Case ID: \`#${penal.id}\`
Jailed Member: ${member.toString()} \`(${member.user.username.replace(/\`/g, "")} - ${member.user.id})\`
Jailed by: ${message.author} \`(${message.author.username.replace(/\`/g, "")} - ${message.author.id})\`
Jailed at: \`${moment(Date.now()).format("LLL")}\`
Jail reason: \`${reason}\`
      `)
    message.guild.channels.cache.get(conf.penals.jail.log).send(log);

    if (conf.penals.jail.limit > 0) {
      if (!jailLimit.has(message.author.id)) jailLimit.set(message.author.id, 1);
      else jailLimit.set(message.author.id, jailLimit.get(message.author.id) + 1);
      setTimeout(() => {
        if (jailLimit.has(message.author.id)) jailLimit.delete(message.author.id);
      }, 1000 * 60 * 60);
    }
  },
};
