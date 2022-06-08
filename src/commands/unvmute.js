const conf = require("../configs/config.json");
const { MessageEmbed } = require("discord.js");
const moment = require("moment");
moment.locale("tr");

module.exports = {
  conf: {
    aliases: ['unvmute', 'unvm'],
    name: "unvoicemute",
    help: "unvoicemute [user]",
  },

  /**
   * @param { Client } client
   * @param { Message } message
   * @param { Array<String> } args
   */

  run: async (client, message, args, embed) => {
    if (!message.member.hasPermission(8) && !conf.penals.voiceMute.staffs.some(x => message.member.roles.cache.has(x))) return message.channel.error(message, "Not enough Permission!");
    const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
    if (!member) return message.channel.error(message, "You must specify a member!");
    if (!conf.penals.voiceMute.roles.some(x => member.roles.cache.has(x)) && (member.voice.channelID && !member.voice.serverMute)) return message.channel.error(message, "This member isn't voicemuted!");
    if (!message.member.hasPermission(8) && member.roles.highest.position >= message.member.roles.highest.position) return message.channel.error(message, "You can't un voicemute someone that have the same or higher role than you!");
    if (!member.manageable) return message.channel.error(message, "I can't un voicemute this member!");

    member.roles.remove(conf.penals.voiceMute.roles);
    message.channel.send(`Member ${member.toString()} have been un voicemuted by ${message.author}!`);
    if (conf.dmMessages) member.send(`You have been un voicemuted at **${message.guild.name}** by **${message.author.tag}**!`).catch(() => {});

    const log = new MessageEmbed()
      .setAuthor(member.user.username, member.user.avatarURL({ dynamic: true, size: 2048 }))
      .setColor("GREEN")
      .setTitle("Member un Voicemuted!")
      .setDescription(`
${member.toString()} has been un voicemuted!

Unmuted Member: ${member.toString()} \`(${member.user.username.replace(/\`/g, "")} - ${member.user.id})\`
Unmuted by: ${message.author} \`(${message.author.username.replace(/\`/g, "")} - ${message.author.id})\`
Unmuted at: \`${moment(Date.now()).format("LLL")}\`
      `);
    message.guild.channels.cache.get(conf.penals.voiceMute.log).send(log);
  },
};
