require("console-stamp")(console);

const fs = require("fs");
const Discord = require("discord.js");
const { prefix, token } = require("./config.json");

const client = new Discord.Client();
client.commands = new Discord.Collection();

// Add commands
const commandFiles = fs.readdirSync("./commands").filter(file => file.endsWith(".js"));
for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
}

client.once("ready", () => {
    // connectToVoice();
    console.log("Bjarke er klar!");
});

client.on("message", async message => {
    if (!message.content.startsWith(prefix) || message.author.bot) return;

    const args = message.content.slice(prefix.length).split(/ +/);
    const commandName = args.shift().toLowerCase();

    const command = client.commands.get(commandName);

    if (command.args && !args.length) {
        return await message.channel.send(`Hvad med lige at fortælle mig hvad jeg skal gøre, ${message.author}!?`);
    }

    try {
        await command.execute(message, args);
    } catch (error) {
        console.error(error);
        message.reply("find dig sku da en anden hobby!");
    }
});

client.login(token);
