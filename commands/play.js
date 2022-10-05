const fs = require("fs");
const { joinVoiceChannel } = require("@discordjs/voice");
module.exports = {
    name: "play",
    usage: "<navn på lyd>",
    description: "Afspil lyd",
    execute(message, args) {
        play(message, args);
    },
};

async function play(message, args) {
    const data = [];
    const path = "/sound/" + args[0] + ".mp3";
    if (message.member.voice.channel) {
        const connection = joinVoiceChannel({
            channelId: message.member.voice.channel.id,
            guildId: message.guild.id,
            adapterCreator: message.guild.voiceAdapterCreator,
        });
        fs.access(path, fs.F_OK, (err) => {
            if (err) {
                connection.disconnect();
                data.push("Hov! Den lyd har jeg ikke, du kan vælge mellem:");
                fs.readdir("/sound/", (err, files) => {
                    // handling error
                    if (err) {
                        return console.error("Unable to scan directory: " + err);
                    }
                    // listing all files using forEach
                    files.forEach((file) => {
                        data.push("`" + file.split(".")[0] + "`");
                    });
                    message.channel.send(data, { split: true });
                });
            } else {
                const dispatcher = connection.play(fs.createReadStream(path));
                console.log("Started playing: " + path + " in server: " + message.guild.name + "/" + message.member.voice.channel.name + " as requested by: " + message.author.username);

                dispatcher.once("finish", () => {
                    connection.disconnect();
                    console.log("Finished playing");
                });

                dispatcher.on("error", console.error);
            }
        });
    } else {
        message.reply("du skal være i en voice chat...");
        console.log("User: " + message.author.username + " attempted to play sound: " + path + " but wasnt in voice");
    }
}