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
    const title = video.title.replace(/[\\/:*?"<>|]/g, '');
    let audioUrl;

    await sock.sendMessage(chatId, {
      text: `🎶 *${video.title}*\n📥 Please wait while downloading...`
    });

    // Try vidhub API first
    try {
      const api1 = `https://vidhub.cloud/api/ytmp3?url=https://youtube.com/watch?v=${video.videoId}`;
      const res1 = await axios.get(api1);
      audioUrl = res1.data?.result?.url_audio || res1.data?.url;
    } catch (e) {
      console.log('[vidhub API failed]');
    }

    // If first fails, try noobs-api
    if (!audioUrl) {
      try {
        const api2 = `https://noobs-api.top/dipto/ytDl3?link=${video.videoId}&format=mp3`;
        const res2 = await axios.get(api2);
        audioUrl = res2.data?.downloadLink;
      } catch (e) {
        console.log('[noobs-api failed]');
      }
    }

    if (!audioUrl) {
      return await sock.sendMessage(chatId, {
        text: "❌ Failed to fetch download link from all sources. Try again later."
      });
    }

    await sock.sendMessage(chatId, {
      audio: { url: audioUrl },
      mimetype: "audio/mpeg",
      fileName: `${title}.mp3`
    }, { quoted: message });

  } catch (error) {
    console.error('Error in play command:', error);
    await sock.sendMessage(chatId, {
      text: "⚠️ Download failed. Please try again later."
    });
  }
}

module.exports = playCommand;
