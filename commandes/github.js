async function githubCommand(sock, chatId) {
    const repoInfo = `*🤖 Arslan-MD*

*📂 GitHub Repository:*
https://github.com/Arslan-MD/Arslan-MD

*📢 Official Channel:*
https://youtube.com/@arslanmdofficial

_Star ⭐ the repository if you like the bot!_`;

    try {
        const imagePath = path.join(__dirname, '../assets/bot_image.jpg');

        if (fs.existsSync(imagePath)) {
            const imageBuffer = fs.readFileSync(imagePath);
            await sock.sendMessage(chatId, {
                image: imageBuffer,
                caption: helpMessage
            }, { quoted: message });
        } else {
            await sock.sendMessage(chatId, {
                text: helpMessage
            }, { quoted: message });
        }
    } catch (error) {
        console.error('Error in help command:', error);
        await sock.sendMessage(chatId, {
            text: helpMessage
        });
    }
}

module.exports = githubCommand; 
