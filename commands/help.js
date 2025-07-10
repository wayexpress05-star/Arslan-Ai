const settings = require('../settings');
const fs = require('fs');
const path = require('path');

async function helpCommand(sock, chatId, message) {
    const helpMessage = `
╔═══════════════════╗
   *🤖 ${settings.botName || 'Arslan-Ai'}*  
   Version: *${settings.version || '2.0.5'}*
   by ${settings.botOwner || 'ArslanMD Official'}
   YT : ${global.ytch}
╚═══════════════════╝

╔═══════════════════╗
📹 *Video Note Command*:
║ ➤ .vnote - Send circular video note
╚═══════════════════╝

*Available Commands:*

╔═══════════════════╗
🌐 *General Commands*:
║ ➤ .help or .menu
║ ➤ .ping
║ ➤ .alive
... (continue your full menu here)

╔═══════════════════╗
🎧 *Audio Note Command*:
║ ➤ .vmp3 - Send voice audio note
╚═══════════════════╝
`;

    try {
        // Step 1: Send circular video note
        const videoPath = path.join(__dirname, '../media/vnote.mp4');
        if (fs.existsSync(videoPath)) {
            await sock.sendMessage(
                chatId,
                {
                    video: fs.readFileSync(videoPath),
                    mimetype: 'video/mp4',
                    ptt: true
                },
                { quoted: message }
            );
        }

        // Step 2: Send menu text with optional banner image
        const imagePath = path.join(__dirname, '../assets/bot_banner.jpg');
        if (fs.existsSync(imagePath)) {
            await sock.sendMessage(
                chatId,
                {
                    image: fs.readFileSync(imagePath),
                    caption: helpMessage,
                    contextInfo: {
                        forwardingScore: 1,
                        isForwarded: true,
                        forwardedNewsletterMessageInfo: {
                            newsletterJid: '120363348739987203@newsletter',
                            newsletterName: 'Arslan-Ai',
                            serverMessageId: -1
                        }
                    }
                },
                { quoted: message }
            );
        } else {
            await sock.sendMessage(chatId, {
                text: helpMessage
            });
        }

        // Step 3: Send voice note
        const audioPath = path.join(__dirname, '../media/audio.mp3');
        if (fs.existsSync(audioPath)) {
            await sock.sendMessage(
                chatId,
                {
                    audio: fs.readFileSync(audioPath),
                    mimetype: 'audio/mp4',
                    ptt: true
                },
                { quoted: message }
            );
        }

    } catch (error) {
        console.error('Error in help command:', error);
        await sock.sendMessage(chatId, { text: helpMessage });
    }
}

module.exports = helpCommand;
