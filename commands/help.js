const moment = require('moment-timezone');
const fs = require('fs');
const path = require('path');

async function menuCommand(sock, m, command, prefix, from, pushName) {
    const time = moment().tz('Asia/Karachi').format('hh:mm A');
    const date = moment().tz('Asia/Karachi').format('dddd, MMMM Do YYYY');

    const menuText = `
╭━━━〔 🤖 *Arslan-MD Bot Menu* 〕━━━⬣
┃ 👤 *User:* ${pushName}
┃ 📆 *Date:* ${date}
┃ ⏰ *Time:* ${time}
┃ 🧩 *Prefix:* ${prefix}
╰━━━━━━━━━━━━━━━━━━⬣

╭─〔 🎉 𝗙𝘂𝗻 & 𝗚𝗮𝗺𝗲𝘀 〕─⬣
┃ 🎭 ${prefix}joke
┃ 🧠 ${prefix}riddle
┃ 😂 ${prefix}meme
┃ 🎲 ${prefix}truth
┃ 🎯 ${prefix}dare
┃ 🧙 ${prefix}character @user
┃ 🎰 ${prefix}slot
┃ 🧩 ${prefix}guess [emoji]

╭─〔 📥 𝗗𝗼𝘄𝗻𝗹𝗼𝗮𝗱 𝗧𝗼𝗼𝗹𝘀 〕─⬣
┃ 🎧 ${prefix}play [song]
┃ 🎥 ${prefix}ytmp3 / ytmp4
┃ 📸 ${prefix}ig [link]
┃ 🐦 ${prefix}twitter [link]
┃ 📘 ${prefix}fb [link]
┃ 🎬 ${prefix}tiktok [link]
┃ 🖼️ ${prefix}pinterest [search]

╭─〔 🖼️ 𝗦𝘁𝗶𝗰𝗸𝗲𝗿 & 𝗘𝗱𝗶𝘁 〕─⬣
┃ 🖼️ ${prefix}sticker
┃ 🌈 ${prefix}attp [text]
┃ 🧢 ${prefix}emojimix 😅+❤️
┃ 🪞 ${prefix}removebg
┃ 🎨 ${prefix}styletext [text]
┃ 🔁 ${prefix}toimg / tovideo

╭─〔 🔎 𝗔𝗜 & 𝗜𝗻𝗳𝗼 〕─⬣
┃ 🤖 ${prefix}gpt [prompt]
┃ 🧠 ${prefix}ai-img [desc]
┃ 📚 ${prefix}google [query]
┃ 📖 ${prefix}wikipedia
┃ 📊 ${prefix}ping
┃ 🧾 ${prefix}shortlink
┃ 🕋 ${prefix}quran [surah]

╭─〔 🔧 𝗨𝘁𝗶𝗹𝘀 & 𝗙𝗶𝗹𝗲𝘀 〕─⬣
┃ 📤 ${prefix}upload
┃ 📥 ${prefix}mediafire [url]
┃ 🗂️ ${prefix}tourl
┃ 📝 ${prefix}ocr (image text)
┃ 🧾 ${prefix}readmore

╭─〔 👑 𝗔𝗱𝗺𝗶𝗻 𝗖𝗺𝗱𝘀 〕─⬣
┃ 👥 ${prefix}group open/close
┃ 🧾 ${prefix}tagall
┃ 🚫 ${prefix}kick @user
┃ 👑 ${prefix}promote
┃ 🔻 ${prefix}demote
┃ 📝 ${prefix}setname/setdesc

╭─〔 💻 𝗢𝘄𝗻𝗲𝗿 𝗧𝗼𝗼𝗹𝘀 〕─⬣
┃ 🧠 ${prefix}eval
┃ ⚙️ ${prefix}setpp
┃ ✏️ ${prefix}setbio
┃ 📵 ${prefix}block/unblock
┃ ♻️ ${prefix}restart
┃ 🔒 ${prefix}ban/unban

╭─〔 📣 𝗕𝗼𝘁 𝗜𝗻𝗳𝗼 〕─⬣
┃ 💌 ${prefix}donate
┃ 🧾 ${prefix}script
┃ 🧑‍💻 ${prefix}owner
┃ 📺 ${prefix}channel
┃ 🔗 ${prefix}invite

╰━━━━━━━〔 💎 *Arslan-MD v2.0* 〕━━━━━━⬣
`;

    // Paths to media files
    const gifPath = path.join(__dirname, '../ArslanMedia/media/menu.gif');
    const voicePath = path.join(__dirname, '../ArslanMedia/audio/welcome.mp3');

    // Send GIF with menu text
    await sock.sendMessage(from, {
        video: fs.readFileSync(gifPath),
        gifPlayback: true,
        caption: menuText
    }, { quoted: m });

    // Send voice message
    await sock.sendMessage(from, {
        audio: fs.readFileSync(voicePath),
        mimetype: 'audio/mp4',
        ptt: true
    }, { quoted: m });
}

module.exports = menuCommand;
