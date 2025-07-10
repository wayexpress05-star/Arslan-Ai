const axios = require('axios');
const yts = require('yt-search');

module.exports = {
  name: "play",
  alias: ["music"],
  desc: "Download and play MP3 from YouTube",
  category: "download",
  react: "🎧",
  usage: '.play <song name>',
  start: async (sock, m, { text, args, prefix, command }) => {
    try {
      if (!text) {
        return m.reply(`❌ Please provide a song name!\n\nExample: *${prefix + command} Tu hai kahan*`);
      }

      let search = await yts(text);
      let video = search.videos[0];
      if (!video) return m.reply("❌ No results found!");

      let fileName = `${video.title.replace(/[\\/:*?"<>|]/g, '')}.mp3`;
      let apiUrl = `https://noobs-api.top/dipto/ytDl3?link=${video.videoId}&format=mp3`;

      await m.reply(`🎧 *Title:* ${video.title}\n📥 Downloading MP3...`);

      let res = await axios.get(apiUrl);
      let data = res.data;

      if (!data.downloadLink) return m.reply("❌ Failed to get audio link.");

      await sock.sendMessage(m.chat, {
        audio: { url: data.downloadLink },
        mimetype: 'audio/mpeg',
        fileName
      }, { quoted: m });

    } catch (err) {
      console.error('PLAY ERROR:', err);
      m.reply("⚠️ Error occurred while downloading the song.");
    }
  }
};
