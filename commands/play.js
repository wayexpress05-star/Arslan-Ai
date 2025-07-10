const yts = require('yt-search');
const axios = require('axios');

async function playCommand(sock, chatId, message) {
  try {
    const text = message.message?.conversation || message.message?.extendedTextMessage?.text;
    const searchQuery = text?.split(' ').slice(1).join(' ').trim();

    if (!searchQuery) {
      return await sock.sendMessage(chatId, {
        text: "❌ What song do you want to download?\n\n_Use: .play Tum Mile_"
      });
    }

    const { videos } = await yts(searchQuery);
    if (!videos || videos.length === 0) {
      return await sock.sendMessage(chatId, {
        text: "❌ No songs found!"
      });
    }

    const video = videos[0];
    const apiUrl = `https://noobs-api.top/dipto/ytDl3?link=${video.videoId}&format=mp3`;

    await sock.sendMessage(chatId, {
      text: `🎶 *${video.title}*\n📥 Please wait while downloading...`
    });

    const response = await axios.get(apiUrl);
    const data = response.data;

    if (!data || !data.downloadLink) {
      return await sock.sendMessage(chatId, {
        text: "❌ Failed to fetch audio from the API. Please try again later."
      });
    }

    const audioUrl = data.downloadLink;
    const fileName = `${video.title.replace(/[\\/:*?"<>|]/g, '')}.mp3`;

    await sock.sendMessage(chatId, {
      audio: { url: audioUrl },
      mimetype: "audio/mpeg",
      fileName
    }, { quoted: message });

  } catch (error) {
    console.error('Error in play command:', error);
    await sock.sendMessage(chatId, {
      text: "⚠️ Download failed. Please try again later."
    });
  }
}

module.exports = playCommand;
