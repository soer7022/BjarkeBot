const fs = require('node:fs');
const path = require('node:path');
const {Client, GatewayIntentBits, Collection} = require('discord.js');
const {token} = require('./config.json');

const client = new Client({intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildVoiceStates]});

// Add commands to the bot
client.commands = new Collection();
const commandsPath = path.join(__dirname, 'commands');
const soundPath = path.join(__dirname, 'sound');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const command = require(path.join(commandsPath, file));
    client.commands.set(command.data.name, command);
}


client.once('ready', () => {
    console.log('Ready!');
});

client.on('interactionCreate', async interaction => {
    if (!interaction.isChatInputCommand()) return;
    const command = client.commands.get(interaction.commandName);
    if (!command) return;

    try {
        console.log('Executing command', interaction.commandName, "for user", interaction.user.username);
        await command.execute(interaction);
    } catch (error) {
        console.error(error);
        await interaction.reply({content: 'There was an error while executing this command!', ephemeral: true});
    }
});

// handle autocomplete interactions
client.on('interactionCreate', async interaction => {
    if (!interaction.isAutocomplete()) return;

    if (interaction.commandName === 'play') {
        const focusedValue = interaction.options.getFocused();
        const soundFiles = fs.readdirSync(soundPath).filter(file => file.endsWith('.mp3'));
        let filtered = soundFiles.filter(file => file.startsWith(focusedValue));
        filtered = filtered.map(file => file.split(".")[0]);
        if (filtered.length > 25) {
            filtered = filtered.slice(0, 25);
        }
        try {
            await interaction.reply(filtered.map(choice => ({name: choice, value: choice})));
        } catch (error) {
            console.error(error);
            await interaction.reply({content: 'There was an error while executing this command!', ephemeral: true});
        }
    }
});

client.login(token);