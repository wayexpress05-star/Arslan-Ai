const yts = require('yt-search');
const ytdl = require('ytdl-core');
const fs = require('fs-extra');
const path = require('path');
const axios = require('axios');

async function songCommand(sock, chatId, message) {
    try {
        const prefix = '.';
        const text = message.message?.conversation || message.message?.extendedTextMessage?.text || '';
        const query = text.split(' ').slice(1).join(' ').trim();

        if (!query) {
            await sock.sendMessage(chatId, {
                react: { text: '🎵', key: message.key }
            });
            return await sock.sendMessage(chatId, {
                text: `❌ *Please provide a song name!*\n\n💡 Example: \`${prefix}song pasoori\``
            }, { quoted: message });
        }

        // 🎧 Instant react + sticker
        await sock.sendMessage(chatId, { react: { text: '🎧', key: message.key } });

        const stickerPath = path.join(__dirname, '../assets/loading.webp');
        if (fs.existsSync(stickerPath)) {
            await sock.sendMessage(chatId, {
                sticker: fs.readFileSync(stickerPath)
            }, { quoted: message });
        }

        // 🔍 Search song
        const search = await yts(query);
        const video = search.videos?.[0];
        if (!video) {
            return await sock.sendMessage(chatId, {
                text: `❌ *No results found for:* "${query}"`,
                react: { text: '⚠️', key: message.key }
            });
        }

        const { title, url, thumbnail, duration, views, author } = video;
        const audioPath = path.join(__dirname, `ArslanMD_${Date.now()}.mp3`);
        const thumbPath = path.join(__dirname, `thumb_${Date.now()}.jpg`);

        // Download thumbnail
        const thumb = await axios.get(thumbnail, { responseType: 'arraybuffer' });
        await fs.outputFile(thumbPath, thumb.data);

        // Info preview
        await sock.sendMessage(chatId, {
            image: fs.readFileSync(thumbPath),
            caption: `🎶 *Now Playing:*\n\n📌 *${title}*\n🕒 ${duration.timestamp}\n📺 ${author.name}\n🔗 ${url}\n\n⌛ _Downloading..._`
        }, { quoted: message });

        // 🔽 Download audio
        const stream = ytdl(url, { filter: 'audioonly', quality: 'highestaudio' });
        const writer = fs.createWriteStream(audioPath);

        await new Promise((resolve, reject) => {
            stream.pipe(writer);
            writer.on('finish', resolve);
            writer.on('error', reject);
        });

        // ✅ File check
        if (!fs.existsSync(audioPath) || fs.statSync(audioPath).size < 10000) {
            return await sock.sendMessage(chatId, {
                text: '❌ Failed to download the song. Try another one.',
                react: { text: '⚠️', key: message.key }
            });
        }

        // 📤 Send audio
        await sock.sendMessage(chatId, {
            audio: fs.readFileSync(audioPath),
            mimetype: 'audio/mpeg',
            fileName: `${title}.mp3`
        }, { quoted: message });

        // ✅ Success react
        await sock.sendMessage(chatId, {
            react: { text: '✅', key: message.key }
        });

        // 🧹 Cleanup
        fs.unlinkSync(audioPath);
        fs.unlinkSync(thumbPath);

    } catch (err) {
        console.error('[.song] ❌ Error:', err);
        await sock.sendMessage(chatId, {
            text: '❌ *Failed to download the song. Please try again later.*',
            react: { text: '⚠️', key: message.key }
        }, { quoted: message });
    }
}

module.exports = songCommand;
