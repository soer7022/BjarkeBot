const { prefix } = require('../config.json');

module.exports = {
    name: 'help',
    description: 'Her er alt hvad jeg kan',
    aliases: ['commands'],
    usage: '[command name]',
    cooldown: 5,
    execute(message, args) {
        const data = [];
        const { commands } = message.client;

        if (!args.length) {
            data.push('Her er alle mine kommandoer:');
            data.push(commands.map(command => '`' + command.name + '`').join('\n'));
            data.push(`\nDu kan skrive \`${prefix}help [kommando]\` for at få mere specifik hjælp!`);

            return message.author.send(data, { split: true })
                .then(() => {
                    if (message.channel.type === 'dm') return;
                    message.reply('tjek da din DM!');
                })
                .catch(error => {
                    console.error(`Could not send help DM to ${message.author.tag}.\n`, error);
                    message.reply('it seems like I can\'t DM you! Do you have DMs disabled?');
                });
        }
        const name = args[0].toLowerCase();
        const command = commands.get(name) || commands.find(c => c.aliases && c.aliases.includes(name));

        if (!command) {
            return message.reply('Den kommando findes ikke!');
        }

        data.push(`**Navn:** ${command.name}`);

        if (command.aliases) data.push(`**Aliases:** ${command.aliases.join(', ')}`);
        if (command.description) data.push(`**Beskrivelse:** ${command.description}`);
        if (command.usage) data.push(`**Brug:** ${prefix}${command.name} ${command.usage}`);
        if (command.cooldown) data.push(`**Cooldown:** ${command.cooldown}`);

        message.channel.send(data, { split: true });
    },
};