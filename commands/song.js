const { default: axios } = require("axios");
const fs = require("fs-extra");
const path = require("path");
const DY_SCRAP = require("@dark-yasiya/scrap");
const dy_scrap = new DY_SCRAP();

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

        // 🎶 React & Sticker
        await sock.sendMessage(chatId, { react: { text: "🎶", key: message.key } });
        const stickerPath = path.resolve("ArslanMedia/stickers/loading.webp");
        if (fs.existsSync(stickerPath)) {
            await sock.sendMessage(chatId, {
                sticker: fs.readFileSync(stickerPath)
            }, { quoted: message });
        }

        // 🔎 Search YouTube via scrap API
        const searchResult = await dy_scrap.ytsearch(query);
        if (!searchResult?.results?.length) {
            return await sock.sendMessage(chatId, {
                text: "❌ No song found. Please try another name."
            }, { quoted: message });
        }

        const video = searchResult.results[0];
        const { title, url, image, timestamp, views, ago, author } = video;

        // ⏬ Download MP3
        const mp3data = await dy_scrap.ytmp3(url);
        const audioURL = mp3data?.result?.download?.url;
        if (!audioURL) {
            return await sock.sendMessage(chatId, {
                text: "❌ Unable to fetch audio. Try again later."
            }, { quoted: message });
        }

        // 🖼 Download thumbnail
        const thumbPath = path.resolve(`./temp/thumb_${Date.now()}.jpg`);
        const thumb = await axios.get(image, { responseType: 'arraybuffer' });
        await fs.outputFile(thumbPath, thumb.data);

        // 📄 Song info card
        const caption = `🎶 *Now Playing:*\n\n` +
            `📌 *Title:* ${title}\n` +
            `🕒 *Duration:* ${timestamp || "N/A"}\n` +
            `📈 *Views:* ${views || "N/A"}\n` +
            `📅 *Published:* ${ago || "N/A"}\n` +
            `👤 *Author:* ${author?.name || "N/A"}\n` +
            `🔗 ${url}\n\n` +
            `_🔊 Powered by ArslanMD Official_`;

        // 🖼️ Send song info with image
        await sock.sendMessage(chatId, {
            image: fs.readFileSync(thumbPath),
            caption
        }, { quoted: message });

        // 🎵 Send the MP3
        await sock.sendMessage(chatId, {
            audio: { url: audioURL },
            mimetype: 'audio/mpeg',
            fileName: `${title}.mp3`
        }, { quoted: message });

        // ✅ Success emoji
        await sock.sendMessage(chatId, {
            react: { text: "✅", key: message.key }
        });

        // 🧹 Cleanup
        fs.unlinkSync(thumbPath);

    } catch (err) {
        console.error("[.song] Error:", err);
        await sock.sendMessage(chatId, {
            react: { text: "⚠️", key: message.key }
        });
        await sock.sendMessage(chatId, {
            text: "❌ *Failed to download the song.* Please try again later."
        }, { quoted: message });
    }
}

module.exports = songCommand;
