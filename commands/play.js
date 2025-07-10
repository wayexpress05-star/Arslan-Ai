const { cmd } = require('../command');
const yts = require('yt-search');
const axios = require('axios');

const BASE_URL = 'https://noobs-api.top';

cmd({
    pattern: "play",
    alias: ["music"],
    desc: "Download and play MP3 from YouTube",
    category: "Download",
    react: "🎧",
    filename: __filename
},
async (conn, msg, { q }) => {
    if (!q) return msg.reply("🔍 Please provide a song name to search.");
    
    try {
        const search = await yts(q);
        const video = search.videos[0];
        if (!video) return msg.reply("❌ No results found.");

        const fileName = `${video.title.replace(/[\\/:*?"<>|]/g, '')}.mp3`;
        const apiURL = `${BASE_URL}/dipto/ytDl3?link=${video.videoId}&format=mp3`;

        const { data } = await axios.get(apiURL);
        if (!data.downloadLink) return msg.reply("❌ Failed to get the audio link.");

        await msg.reply(`🎶 *${video.title}*\n📥 Downloading MP3...`);

        await conn.sendMessage(msg.chat, {
            audio: { url: data.downloadLink },
            mimetype: 'audio/mpeg',
            fileName
        }, { quoted: msg });

    } catch (err) {
        console.error('[PLAY]', err);
        msg.reply("⚠️ Error occurred while downloading.");
    }
});
