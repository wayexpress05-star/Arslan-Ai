const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

async function songCommand(sock, chatId, message) {
    try {
        const text = message.message?.conversation || message.message?.extendedTextMessage?.text || '';
        const query = text.split(" ").slice(1).join(" ").trim();

        if (!query) {
            await sock.sendMessage(chatId, {
                react: { text: "❌", key: message.key }
            });
            return await sock.sendMessage(chatId, {
                text: "🎵 *Usage:* `.song song name`\n\n_Example:_ `.song pasoori`"
            }, { quoted: message });
        }

        // 🌀 React & Loading sticker
        await sock.sendMessage(chatId, { react: { text: "🎶", key: message.key } });
        const stickerPath = path.resolve("ArslanMedia/stickers/loading.webp");
        if (fs.existsSync(stickerPath)) {
            await sock.sendMessage(chatId, {
                sticker: fs.readFileSync(stickerPath)
            }, { quoted: message });
        }

        // 🎧 API Request
        const api = `https://api.lolhuman.xyz/api/ytplay2?apikey=ArslanKey&query=${encodeURIComponent(query)}`;
        const response = await axios.get(api);
        const result = response.data.result;

        const { title, link, thumbnail, duration, views, audio } = result;
        const filePath = path.resolve(`./temp/${Date.now()}_arslan_song.mp3`);
        const thumbPath = path.resolve(`./temp/thumb_${Date.now()}.jpg`);

        // Download audio
        const audioBuffer = await axios.get(audio, { responseType: 'arraybuffer' });
        await fs.outputFile(filePath, audioBuffer.data);

        // Thumbnail
        const thumb = await axios.get(thumbnail, { responseType: 'arraybuffer' });
        await fs.outputFile(thumbPath, thumb.data);

        // 🖼️ Send info image
        await sock.sendMessage(chatId, {
            image: fs.readFileSync(thumbPath),
            caption: `🎶 *Now Playing:*\n\n📌 *${title}*\n🕒 ${duration}\n📈 ${views} views\n🔗 ${link}\n\n_🔊 Powered by ArslanMD Official_`,
        }, { quoted: message });

        // 🎧 Send audio
        await sock.sendMessage(chatId, {
            audio: fs.readFileSync(filePath),
            mimetype: 'audio/mp4',
            fileName: `${title}.mp3`,
            ptt: false
        }, { quoted: message });

        // ✅ Success react
        await sock.sendMessage(chatId, {
            react: { text: "✅", key: message.key }
        });

        // 🧹 Cleanup
        fs.unlinkSync(filePath);
        fs.unlinkSync(thumbPath);

    } catch (err) {
        console.error("[.song] Error:", err);
        await sock.sendMessage(chatId, {
            react: { text: "⚠️", key: message.key }
        });
        await sock.sendMessage(chatId, {
            text: "❌ *Failed to download the song.*\nPlease try again later."
        }, { quoted: message });
    }
}

module.exports = songCommand;
