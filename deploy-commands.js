const fs = require('node:fs');
const path = require('node:path');
const {REST, Routes} = require('discord.js')
const {token, clientId} = require('./config.json');

const rest = new REST({version: '10'}).setToken(token)

const commands = [];
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const command = require(path.join(commandsPath, file));
    commands.push(command.data.toJSON());
}

rest.put(Routes.applicationCommands(clientId, 'commandId'), {body: commands})
    .then((data) => console.log('Successfully registered application commands.', data))
    .catch(console.error);