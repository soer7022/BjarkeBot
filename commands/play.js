const fs = require('fs');
module.exports = {
    name: 'play',
    usage: 'play <navn på lyd>',
    description: 'Afspil lyd',
    execute(message, args) {
        play(message, args);
    },
};

async function play(message, args) {
    const data = [];
    const path = './sound/' + args[0] + '.mp3';
    if (message.member.voice.channel) {
        const connection = await message.member.voice.channel.join();
        fs.access(path, fs.F_OK, (err) => {
            if (err) {
                data.push('Hov! Den lyd har jeg ikke, du kan vælge mellem:');
                fs.readdir('./sound/', (err, files) => {
                    // handling error
                    if (err) {
                        return console.log('Unable to scan directory: ' + err);
                    }
                    // listing all files using forEach
                    files.forEach((file) => {
                        data.push('`' + file.split('.')[0] + '`\n');
                    });
                    message.channel.send(data, { split: true });
                });
            } else {
                const dispatcher = connection.play(fs.createReadStream(path));

                dispatcher.once('finish', () => {
                    connection.disconnect();
                });

                dispatcher.on('error', console.error);
            }
        });
    }
}