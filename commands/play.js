const axios = require("axios");
const yts = require("yt-search");

async function playCommand(sock, chatId, message) {
  try {
    const text = message.message?.conversation || message.message?.extendedTextMessage?.text;
    const searchQuery = text?.split(" ").slice(1).join(" ").trim();

    if (!searchQuery) {
      return await sock.sendMessage(chatId, {
        text: "❌ Please provide a song name.\n\n_Example: .play Tum Mile_"
      });
    }

    await sock.sendMessage(chatId, {
      text: `🎶 Searching and downloading your song...\n\n🤖 *${global.settings.botName}*\n👑 *Owner:* ${global.settings.botOwner}`
    });

    const searchResults = await yts(searchQuery);
    if (!searchResults.videos || searchResults.videos.length === 0) {
      return await sock.sendMessage(chatId, {
        text: `❌ No results found for "${searchQuery}".`
      });
    }

    const firstResult = searchResults.videos[0];
    const videoUrl = firstResult.url;

    const apiUrl = `https://apis.davidcyriltech.my.id/download/ytmp3?url=${videoUrl}`;
    const response = await axios.get(apiUrl);

    if (!response.data.success || !response.data.result?.download_url) {
      return await sock.sendMessage(chatId, {
        text: `❌ Failed to fetch audio from API for "${searchQuery}".`
      });
    }

    const { title, download_url } = response.data.result;

    await sock.sendMessage(chatId, {
      audio: { url: download_url },
      mimetype: "audio/mpeg",
      fileName: `${title.replace(/[\\/:*?"<>|]/g, "")}.mp3`
    }, { quoted: message });

  } catch (error) {
    console.error("Error in play command:", error);
    await sock.sendMessage(chatId, {
      text: "⚠️ Download failed. Please try again later."
    });
  }
}

module.exports = playCommand;
