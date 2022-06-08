const { MessageEmbed } = require("discord.js");
const conf = require("../configs/config.json");
const moment = require("moment");
require("moment-duration-format");
moment.locale("tr");

module.exports = async (guild, user) => {
  if (guild.id !== conf.guildID) return;
  
  let audit = await guild.fetchAuditLogs({ type: 'GUILD_BAN_REMOVE' });
  audit = audit.entries.first();
  if (audit.executor.bot) return;

  const log = new MessageEmbed()
    .setAuthor(user.username, user.avatarURL({ dynamic: true, size: 2048 }))
    .setColor("GREEN")
    .setDescription(`
\`(${user.username.replace(/\`/g, "")} - ${user.id})\` üyesinin banı kaldırıldı!

Banı Kaldıran Yetkili: ${audit.executor} \`(${audit.executor.username.replace(/\`/g, "")} - ${audit.executor.id})\`
Banın Kaldırılma Tarihi: \`${moment(Date.now()).format("LLL")}\`
      `)
  guild.channels.cache.get(conf.penals.ban.log).send(log);
};

module.exports.conf = {
  name: "guildBanRemove",
};
