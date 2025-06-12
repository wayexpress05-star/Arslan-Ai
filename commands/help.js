const settings = require('../settings');
const fs = require('fs');
const path = require('path');

async function menuCommand(sock, chatId, message) {
const botName = settings.botName || 'Arslan-MD';
const version = settings.version || '2.0.2';
const owner = settings.botOwner || 'ArslanMD Official';
const ytch = global.ytch || 'youtube.com/@ArslanMD';

const menuText = `

╔══════════════════════════╗
🔥🔥 𝗪𝗘𝗟𝗖𝗢𝗠𝗘 𝗧𝗢 ${botName} 🔥🔥
╚══════════════════════════╝

╔═══ 🚀 𝗕𝗢𝗧 𝗜𝗡𝗙𝗢 🚀 ═══╗
• Version: ${version}
• Owner: ${owner}
• YouTube: ${ytch}
╚══════════════════════════╝

╔═══ ⚡ 𝗖𝗢𝗠𝗠𝗔𝗡𝗗𝗦 𝗟𝗜𝗦𝗧 ⚡ ═══╗

╔══ 🌐 𝗚𝗘𝗡𝗘𝗥𝗔𝗟 ══╗
• .help / .menu
• .ping / .alive
• .tts <text>
• .joke
• .quote
• .weather <city>
• .lyrics <title>
• .8ball <question>
╚════════════════╝

╔══ 👮‍♂️ 𝗔𝗗𝗠𝗜𝗡 ══╗
• .ban @user
• .kick @user
• .promote @user
• .demote @user
• .mute @user
• .unmute @user
• .clear / .delete
• .warn @user
• .tagall
╚════════════════╝

╔══ 🔒 𝗢𝗪𝗡𝗘𝗥 ══╗
• .mode <on/off>
• .autoreact <on/off>
• .clearsession
• .setpp <image>
╚════════════════╝

╔══ 🎨 𝗦𝗧𝗜𝗖𝗞𝗘𝗥𝗦 ══╗
• .sticker
• .simage
• .blur
• .emojimix
╚════════════════╝

╔══ 🎮 𝗚𝗔𝗠𝗘𝗦 ══╗
• .tictactoe
• .hangman
• .guess
• .trivia
╚════════════════╝

╔══ 🤖 𝗔𝗜 𝗧𝗢𝗢𝗟𝗦 ══╗
• .gpt <text>
• .imagine <prompt>
╚════════════════╝

╔══ 🎯 𝗙𝗨𝗡 ══╗
• .flirt
• .shayari
• .insult
• .compliment
• .ship
╚════════════════╝

╔══ 📥 𝗗𝗢𝗪𝗡𝗟𝗢𝗔𝗗𝗘𝗥𝗦 ══╗
• .play <song name>
• .tiktok <link>
• .instagram <link>
╚════════════════╝

╔══ 💻 𝗚𝗜𝗧𝗛𝗨𝗕 ═╗
• .repo
• .sc
╚═════════════╝

⚡ Use commands smartly! ⚡
`.trim();

try {  
    const imagePath = path.join(__dirname, '../assets/bot_banner.jpg');  
    if (fs.existsSync(imagePath)) {  
        const imageBuffer = fs.readFileSync(imagePath);  
        await sock.sendMessage(chatId, {  
            image: imageBuffer,  
            caption: menuText  
        }, { quoted: message });  
    } else {  
        await sock.sendMessage(chatId, {  
            text: menuText  
        }, { quoted: message });  
    }  
} catch (err) {  
    console.error('Menu Command Error:', err);  
    await sock.sendMessage(chatId, {  
        text: menuText  
    });  
}

}

module.exports = menuCommand;
