const conf = require("../configs/config.json");
const { MessageEmbed } = require("discord.js");
const moment = require("moment");
const banLimit = new Map();
moment.locale("tr");

module.exports = {
  conf: {
    aliases: ["yargı"],
    name: "ban",
    help: "ban [user] [reason]",
  },

  /**
   * @param { Client } client
   * @param { Message } message
   * @param { Array<String> } args
   */

  run: async (client, message, args, embed) => {
    if (!message.member.hasPermission("BAN_MEMBERS") && !conf.penals.ban.staffs.some(x => message.member.roles.cache.has(x))) return message.channel.send(message, "Not enough Permissions!");
    if (!args[0]) return message.channel.error(message, "You must specify a member!");
    const user = message.mentions.users.first() || await client.fetchUser(args[0]);
    if (!user) return message.channel.error(message, "No such user found!");
    const ban = await client.fetchBan(message.guild, args[0]);
    if (ban) return message.channel.error(message, "This member is already banned!");
    const reason = args.slice(1).join(" ") || "Unspecified!";
    const member = message.guild.members.cache.get(user.id);
    if (!message.member.hasPermission(8) && member && member.roles.highest.position >= message.member.roles.highest.position) return message.channel.send("You can't ban someone with the same or higher role with you!");
    if (member && !member.bannable) return message.channel.error(message, "I can't ban this member!");
    if (conf.penals.ban.limit > 0 && banLimit.has(message.author.id) && banLimit.get(message.author.id) == conf.penals.ban.limit) return message.channel.send("You've reached your hourly ban limit!");
    
    message.guild.members.ban(user.id, { reason }).catch(() => {});
    const penal = await client.penalize(message.guild.id, user.id, "BAN", true, message.author.id, reason);
    const gifs = ["https://media1.tenor.com/images/ed33599ac8db8867ee23bae29b20b0ec/tenor.gif?itemid=14760307", "https://media.giphy.com/media/fe4dDMD2cAU5RfEaCU/giphy.gif", "https://media1.tenor.com/images/4732faf454006e370fa9ec6e53dbf040/tenor.gif?itemid=14678194"];
    message.channel.send(`Member ${member ? member.toString() : user.username} has been banned by ${message.author} because of: \`${reason}\`! \`(Case ID: #${penal.id})\``);
    if (conf.dmMessages) user.send(`You have been banned from**${message.guild.name}** by **${message.author.tag}**, because of: **${reason}**`).catch(() => {});

    const log = new MessageEmbed()
      .setAuthor(user.username, user.avatarURL({ dynamic: true, size: 2048 }))
      .setColor("RED")
      .setTitle("Member Banned")
      .setDescription(`
${member ? member.toString() : user.username} has been banned!

Case ID: \`#${penal.id}\`
Member Banned: ${member ? member.toString() : ""} \`(${user.username.replace(/\`/g, "")} - ${user.id})\`
Banned by: ${message.author} \`(${message.author.username.replace(/\`/g, "")} - ${message.author.id})\`
Banned at: \`${moment(Date.now()).format("LLL")}\`
Ban reason: \`${reason}\`
      `)
      .setImage(gifs.random())
    message.guild.channels.cache.get(conf.penals.ban.log).send(log);

    if (conf.penals.ban.limit > 0) {
      if (!banLimit.has(message.author.id)) banLimit.set(message.author.id, 1);
      else banLimit.set(message.author.id, banLimit.get(message.author.id) + 1);
      setTimeout(() => {
        if (banLimit.has(message.author.id)) banLimit.delete(message.author.id);
      }, 1000 * 60 * 60);
    }
  },
};
