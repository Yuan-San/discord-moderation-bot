const conf = require("../configs/config.json");
const { MessageEmbed } = require("discord.js");
const moment = require("moment");
const vmuteLimit = new Map();
moment.locale("tr");
const ms = require("ms");

module.exports = {
  conf: {
    aliases: ["vmute", "voice-mute"],
    name: "voicemute",
    help: "voicemute [user] [duration] [reason]",
  },

  /**
   * @param { Client } client
   * @param { Message } message
   * @param { Array<String> } args
   */

  run: async (client, message, args, embed) => {
    if (!message.member.hasPermission(8) && !conf.penals.voiceMute.staffs.some(x => message.member.roles.cache.has(x))) return message.channel.error(message, "Not enough permission!");
    const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
    if (!member) return message.channel.error(message, "You must specify a member!");
    if (conf.penals.voiceMute.roles.some(x => member.roles.cache.has(x))) return message.channel.error(message, "This member is already voicemuted!");
    const duration = args[1] ? ms(args[1]) : undefined;
    if (!duration) return message.channel.error(message, `You must specify a valid voicemute duration!`);
    const reason = args.slice(2).join(" ") || "Unspecified";
    if (!message.member.hasPermission(8) && member.roles.highest.position >= message.member.roles.highest.position) return message.channel.error(message, "You can't voicemute someone who have the same or higher role with you!");
    if (!member.manageable) return message.channel.error(message, "I can't voicemute this member!");
    if (conf.penals.voiceMute.limit > 0 && vmuteLimit.has(message.author.id) && vmuteLimit.get(message.author.id) == conf.penals.voiceMute.limit) return message.channel.error(message, "You have reached your hourly voicemute limit!");

    member.roles.add(conf.penals.voiceMute.roles);
    if (member.voice.channelID && !member.voice.serverMute) {
      member.voice.setMute(true);
      member.roles.add(conf.penals.voiceMute.roles);
    }
    const penal = await client.penalize(message.guild.id, member.user.id, "VOICE-MUTE", true, message.author.id, reason, true, Date.now() + duration);
    const time = ms(duration).replace("h", " hour(s)").replace("m", " minute(s)").replace("s", " second(s)");
    message.channel.send(embed.setDescription(`Member ${member.toString()} has been Voicemuted by ${message.author} because of \`${reason}\` for **${time}**! \`(Case ID: #${penal.id})\``));
    if (conf.dmMessages) member.send(`You have been Voicemuted at **${message.guild.name}** by **${message.author.tag}** because of **${reason}** for **${time}**!`).catch(() => {});


    const log = new MessageEmbed()
      .setAuthor(member.user.username, member.user.avatarURL({ dynamic: true, size: 2048 }))
      .setColor("RED")
      .setTitle("Member Voicemuted!")
      .setDescription(`
${member.toString()} has been voicemuted for \`${time}\` !

Case ID: \`#${penal.id}\`
Voicemuted Member: ${member.toString()} \`(${member.user.username.replace(/\`/g, "")} - ${member.user.id})\`
Voicemuted by: ${message.author} \`(${message.author.username.replace(/\`/g, "")} - ${message.author.id})\`
Voicemuted at: \`${moment(Date.now()).format("LLL")}\`
Voicemute End Date: \`${moment(Date.now() + duration).format("LLL")}\`
Voicemute reason: \`${reason}\`
      `);
    message.guild.channels.cache.get(conf.penals.voiceMute.log).send(log);

    if (conf.penals.voiceMute.limit > 0) {
      if (!vmuteLimit.has(message.author.id)) vmuteLimit.set(message.author.id, 1);
      else vmuteLimit.set(message.author.id, vmuteLimit.get(message.author.id) + 1);
      setTimeout(() => {
        if (vmuteLimit.has(message.author.id)) vmuteLimit.delete(message.author.id);
      }, 1000 * 60 * 60);
    }
  },
};
