const {SlashCommandBuilder} = require("discord.js");
const {
    createAudioPlayer,
    joinVoiceChannel,
    createAudioResource,
    AudioPlayerStatus,
    NoSubscriberBehavior,
    VoiceConnectionStatus
} = require('@discordjs/voice');
const path = require("node:path");
const fs = require("node:fs");

const soundPath = path.join(__dirname, '..', 'sound');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("play")
        .setDescription("Afspil lyd")
        .addStringOption(option =>
            option.setName("sound")
                .setDescription("Navn på lyd")
                .setRequired(true)
                .setAutocomplete(true)),

    async execute(interaction) {
        const sound = interaction.options.getString("sound");
        const pathToSound = path.join(soundPath, sound + ".mp3");
        if (!fs.existsSync(pathToSound)) {
            let soundList = []
            soundList.push("Hov! Den lyd har jeg ikke, du kan vælge mellem:");
            let files = fs.readdirSync(soundPath).filter(file => file.endsWith('.mp3'))
            files = files.map(file => "`" + file.split(".")[0] + "`")
            soundList = soundList.concat(files);
            await interaction.reply(soundList.join("\n"))
        } else {
            const resource = createAudioResource(pathToSound, {metadata: {title: sound, path: pathToSound}});
            const player = createAudioPlayer({
                behaviors: {
                    noSubscriber: NoSubscriberBehavior.Stop
                }
            });

            player.on(AudioPlayerStatus.Playing, () => {
                console.log('The audio player has started playing: ' + player.state.resource.metadata.title, 'Path: ' + player.state.resource.metadata.path);
            });

            player.on('error', error => {
                console.error('Error:', error.message, 'with track', error.resource.metadata.title);
            });

            player.addListener('stateChange', (oldState, newState) => {
                if (newState.status === AudioPlayerStatus.Idle && oldState.status !== AudioPlayerStatus.Idle) {
                    console.log('The audio player has stopped playing!');
                    connection.destroy();
                }
            });


            const connection = joinVoiceChannel({
                channelId: interaction.member.voice.channelId,
                guildId: interaction.guildId,
                adapterCreator: interaction.guild.voiceAdapterCreator,
            });
            connection.on(VoiceConnectionStatus.Ready, () => {
                player.play(resource);
                connection.subscribe(player);
            });
            //await interaction.reply(`Du har valgt ${sound}`);
            await interaction.reply(`Spiller ${sound}`);
        }
    }
}
