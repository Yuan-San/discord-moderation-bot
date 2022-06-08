const { Client, Collection, Intents} = require("discord.js");
const client = (global.client = new Client({intents: ["GUILDS", "GUILD_MESSAGES", "GUILD_PRESENCES"]}, {fetchAllMembers: true}));
const settings = require("./src/configs/settings.json");
client.commands = new Collection();
client.aliases = new Collection();
client.cooldown = new Map();
require("./src/handlers/commandHandler");
require("./src/handlers/eventHandler");
require("./src/handlers/mongoHandler");
require("./src/handlers/functionHandler")(client);

client
  .login(settings.token)
  .then(() => console.log("[BOT] Bot connected!"))
  .catch(() => console.log("[BOT] Bot can't connected!"));
