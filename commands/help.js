const settings = require('../settings');
const fs = require('fs');
const path = require('path');

async function helpCommand(sock, chatId, message) {
    const helpMessage = `
╔═══════════════════╗
🤖 *${settings.botName || 'Arslan-MD'}*
*Version:* ${settings.version || '2.0.2'}
*By:* ${settings.botOwner || 'ArslanMD Official'}
*YT:* ${global.ytch || 'youtube.com/@ArslanMD'}
╚═══════════════════╝

📜 *Available Commands*

╔════ 🌐 General ════╗
• .help / .menu
• .ping / .alive
• .tts <text>
• .owner / .jid
• .joke / .quote
• .weather <city>
• .lyrics <title>
• .8ball <question>
• .groupinfo / .admins
• .ss <link>
• .trt <text> <lang>
╚════════════════════╝

╔════ 👮 Admin ════╗
• .ban / .kick @user
• .promote / .demote
• .mute / .unmute
• .clear / .delete
• .warn / .warnings
• .tag / .tagall
• .chatbot / .antilink
• .welcome / .goodbye
╚════════════════════╝

╔════ 🔒 Owner ════╗
• .mode / .autoreact
• .clearsession / .cleartmp
• .setpp <img>
╚════════════════════╝

╔══ 🎨 Stickers ══╗
• .sticker / .simage
• .blur / .emojimix
• .meme / .take
╚══════════════════╝

╔════ 🎮 Games ════╗
• .tictactoe / .hangman
• .guess / .trivia
• .truth / .dare
╚════════════════════╝

╔════ 🤖 AI Tools ══╗
• .gpt / .gemini
• .imagine / .flux
╚════════════════════╝

╔════ 🎯 Fun ═════╗
• .flirt / .shayari
• .goodnight / .roseday
• .insult / .compliment
• .ship / .wasted / .simp
╚═══════════════════╝

╔══ 🔤 Text Maker ═╗
• .neon / .devil / .ice / .fire
• .matrix / .glitch / .sand etc.
╚═══════════════════╝

╔══ 📥 Downloader ═╗
• .play / .song <name>
• .tiktok / .instagram / .fb
╚═══════════════════╝

╔══ 💻 GitHub ═════╗
• .repo / .sc / .github
╚═══════════════════╝
`.trim();

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

module.exports = helpCommand;
