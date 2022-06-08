module.exports = {
  conf: {
    aliases: [],
    name: "allmute",
    help: "allmute",
  },

  /**
   * @param { Client } client
   * @param { Message } message
   * @param { Array<String> } args
   */

  run: async (client, message, args, embed) => {
    if (!message.member.hasPermission("MOVE_MEMBERS")) return;
    let channel = message.guild.channels.cache.get(args[0]) || message.member.voice.channel;
    if (!channel) return message.channel.error(message, "You must enter a channel ID or be on a voice channel!");
    channel.members.filter((x) => !x.hasPermission("ADMINISTRATOR"))
      .forEach((x, index) => {
        client.wait(index * 1000);
        x.voice.setMute(true);
      });
    message.channel.send('All members on the channel have been silenced!');
  },
};
