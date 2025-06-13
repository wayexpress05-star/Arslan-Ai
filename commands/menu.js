console.log('⚡ .menu command activated!');
console.log('📥 .menu command triggered');
const moment = require('moment-timezone');
const fs = require('fs');
const path = require('path');

async function menuCommand(sock, m, command, prefix, from, pushName) {
    const time = moment().tz('Asia/Karachi').format('hh:mm A');
    const date = moment().tz('Asia/Karachi').format('dddd, MMMM Do YYYY');

    const menuText = `
╭━〔 🤖 *Arslan-MD Bot Menu* 〕━━━⬣
┃ 👤 *User:* ${pushName}
┃ 📆 *Date:* ${date}
┃ ⏰ *Time:* ${time}
┃ 🧩 *Prefix:* ${prefix}
╰━━━━━━━━━━━━━━━━━━⬣

╭─〔 🎉 Fun & Games 〕─⬣
┃ 🎭 ${prefix}joke
┃ 🎲 ${prefix}truth / dare
┃ 🎯 ${prefix}slot / guess

╭─〔 📥 Downloaders 〕─⬣
┃ 🎧 ${prefix}play [name]
┃ 📸 ${prefix}ig / fb / tiktok
┃ 🖼️ ${prefix}pinterest

╭─〔 🤖 AI Tools 〕─⬣
┃ 🧠 ${prefix}gpt / ai-img
┃ 📚 ${prefix}google / wiki

╭─〔 🧰 Admin & Owner 〕─⬣
┃ 🚫 ${prefix}ban / kick
┃ 👑 ${prefix}promote / demote
┃ ⚙️ ${prefix}setpp / restart

╰━〔 💎 *Arslan-MD v2.0* 〕━━━━━⬣
`;

    try {
        const gifPath = path.resolve('ArslanMedia/media/menu.gif');
        const voicePath = path.resolve('ArslanMedia/audio/welcome.mp3');

        // 🎬 Send GIF
        if (fs.existsSync(gifPath)) {
            await sock.sendMessage(from, {
                video: fs.readFileSync(gifPath),
                gifPlayback: true,
                caption: menuText
            }, { quoted: m });
            console.log("✅ menu.gif sent");
        } else {
            console.warn("⚠️ menu.gif not found");
            await sock.sendMessage(from, {
                text: menuText
            }, { quoted: m });
        }

        // 🔊 Send Voice
        if (fs.existsSync(voicePath)) {
            await sock.sendMessage(from, {
                audio: fs.readFileSync(voicePath),
                mimetype: 'audio/mp4',
                ptt: true
            }, { quoted: m });
            console.log("✅ welcome.mp3 sent");
        } else {
            console.warn("⚠️ welcome.mp3 not found");
        }

    } catch (err) {
        console.error('❌ Error in menuCommand:', err);
        await sock.sendMessage(from, {
            text: `❌ Menu error: ${err.message}`
        }, { quoted: m });
    }
}

module.exports = menuCommand;
