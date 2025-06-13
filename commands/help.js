console.log('⚡ .help command activated!');
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

╔════ 🌐 General ════╗
• ${prefix}help / ${prefix}menu
• ${prefix}ping / ${prefix}alive
• ${prefix}tts <text>
• ${prefix}owner / ${prefix}jid
• ${prefix}joke / ${prefix}quote
• ${prefix}weather <city>
• ${prefix}lyrics <title>
• ${prefix}8ball <question>
• ${prefix}groupinfo / ${prefix}admins
• ${prefix}ss <link>
• ${prefix}trt <text> <lang>

╔════ 👮 Admin ════╗
• ${prefix}ban / ${prefix}kick
• ${prefix}promote / ${prefix}demote
• ${prefix}mute / ${prefix}unmute
• ${prefix}clear / ${prefix}delete
• ${prefix}warn / ${prefix}warnings
• ${prefix}tag / ${prefix}tagall
• ${prefix}chatbot / ${prefix}antilink
• ${prefix}welcome / ${prefix}goodbye

╔════ 🔒 Owner ════╗
• ${prefix}mode / ${prefix}autoreact
• ${prefix}clearsession / ${prefix}cleartmp
• ${prefix}setpp <img>

╔══ 🎮 Games ════╗
• ${prefix}tictactoe / ${prefix}hangman
• ${prefix}guess / ${prefix}trivia
• ${prefix}truth / ${prefix}dare

╔════ 🤖 AI Tools ══╗
• ${prefix}gpt / ${prefix}gemini
• ${prefix}imagine / ${prefix}flux

╔════ 🎯 Fun ═════╗
• ${prefix}flirt / ${prefix}shayari
• ${prefix}goodnight / ${prefix}roseday
• ${prefix}insult / ${prefix}compliment
• ${prefix}ship / ${prefix}wasted / ${prefix}simp

╔══ 🔤 Text Maker ═╗
• ${prefix}neon / ${prefix}devil / ${prefix}ice / ${prefix}fire
• ${prefix}matrix / ${prefix}glitch / ${prefix}sand etc.

╔══ 📥 Downloader ═╗
• ${prefix}play / ${prefix}song <name>
• ${prefix}tiktok / ${prefix}instagram / ${prefix}fb

╔══ 💻 GitHub ═════╗
• ${prefix}repo / ${prefix}sc / ${prefix}github
`.trim();

    try {
        const imagePath = path.resolve('assets/bot_banner.jpg');

        if (fs.existsSync(imagePath)) {
            const imageBuffer = fs.readFileSync(imagePath);
            await sock.sendMessage(chatId, {
                image: imageBuffer,
                caption: helpMessage
            }, { quoted: message });
            console.log("✅ .help image sent with text");
        } else {
            console.warn("⚠️ bot_image.jpg not found, sending text only");
            await sock.sendMessage(chatId, {
                text: helpMessage
            }, { quoted: message });
        }
    } catch (error) {
        console.error('❌ Error in helpCommand:', error);
        await sock.sendMessage(chatId, {
            text: `❌ Error: ${error.message}`
        }, { quoted: message });
    }
}

module.exports = helpCommand;
