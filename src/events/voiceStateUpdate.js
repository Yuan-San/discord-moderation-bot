const conf = require("../configs/config.json");

module.exports = async (oldState, newState) => {
  if (oldState.channelID && !newState.channelID) return;
  const finishedPenal = await penals.findOne({ guildID: newState.guild.id, userID: newState.id, type: "VOICE-MUTE", removed: false, temp: true, finishDate: { $lte: Date.now() } });
  if (finishedPenal) {
    if (newState.serverMute) newState.setMute(false);
    await newState.member.roles.remove(conf.penals.voiceMute.roles);
    finishedPenal.active = false;
    finishedPenal.removed = true;
    await finishedPenal.save();
  }
}

module.exports.conf = {
  name: "voiceStateUpdate",
};
