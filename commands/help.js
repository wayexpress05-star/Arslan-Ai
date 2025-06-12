console.log('📥 .help command triggered');
const settings = require('../settings');
const fs = require('fs');
const path = require('path');

async function helpCommand(sock, chatId, message, prefix = '.') {
    const helpMessage = `
╔═══════════════════╗
🤖 *${settings.botName || 'Arslan-MD'}*
*Version:* ${settings.version || '2.0.2'}
*By:* ${settings.botOwner || 'ArslanMD Official'}
*YT:* ${global.ytch || 'youtube.com/@ArslanMD'}
╚═══════════════════╝

📜 *Available Commands*
• ${prefix}help / ${prefix}menu / ${prefix}ping / ${prefix}alive
• ${prefix}joke / ${prefix}gpt / ${prefix}play / ${prefix}ban / ...
`.trim();

    try {
        const imagePath = path.resolve('assets/bot_image.jpg');

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
        console.error('❌ Error in helpCommand:', error);
        await sock.sendMessage(chatId, {
            text: `❌ Help error: ${error.message}`
        }, { quoted: message });
    }
}

module.exports = helpCommand;
