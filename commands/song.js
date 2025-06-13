const yts = require('yt-search');
const ytdl = require('ytdl-core');
const fs = require('fs-extra');
const path = require('path');
const axios = require('axios');

async function songCommand(sock, chatId, message) {
    const prefix = '.';
    try {
        const text = message.message?.conversation || message.message?.extendedTextMessage?.text || '';
        const query = text.split(' ').slice(1).join(' ');

        if (!query) {
            await sock.sendMessage(chatId, {
                react: { text: '🎵', key: message.key }
            });
            return await sock.sendMessage(chatId, {
                text: `🎧 *Usage:* \`${prefix}song song name\`\n\n_Example:_ \`${prefix}song alone alan walker\``
            }, { quoted: message });
        }

        // React & loading sticker
        await sock.sendMessage(chatId, { react: { text: '🔎', key: message.key } });
        await sock.sendMessage(chatId, {
            sticker: fs.readFileSync('./assets/loading.webp') // 🔁 Your loading sticker path
        }, { quoted: message });

        const search = await yts(query);
        const video = search.videos[0];
        if (!video) {
            return await sock.sendMessage(chatId, {
                text: '❌ No results found!',
                react: { text: '⚠️', key: message.key }
            });
        }

        const { title, url, thumbnail, duration, views } = video;
        const audioPath = path.resolve(`./temp/${Date.now()}.mp3`);
        const thumbPath = path.resolve(`./temp/${Date.now()}_thumb.jpg`);

        // Download thumbnail
        const thumbImg = await axios.get(thumbnail, { responseType: 'arraybuffer' });
        await fs.outputFile(thumbPath, thumbImg.data);

        // Inform user
        await sock.sendMessage(chatId, {
            image: fs.readFileSync(thumbPath),
            caption: `🎵 *${title}*\n\n⏱️ *Duration:* ${duration.timestamp}\n👀 *Views:* ${views.toLocaleString()}\n🔗 ${url}\n\n⌛ _Downloading..._`,
        }, { quoted: message });

        // Download audio
        const stream = ytdl(url, { filter: 'audioonly', quality: 'highestaudio' });
        const writer = fs.createWriteStream(audioPath);
        await new Promise((resolve, reject) => {
            stream.pipe(writer);
            writer.on('finish', resolve);
            writer.on('error', reject);
        });

        // Send audio
        await sock.sendMessage(chatId, {
            audio: fs.readFileSync(audioPath),
            mimetype: 'audio/mp4',
            fileName: `${title}.mp3`,
            ptt: false
        }, { quoted: message });

        await sock.sendMessage(chatId, { react: { text: '✅', key: message.key } });

        // Cleanup
        fs.unlinkSync(audioPath);
        fs.unlinkSync(thumbPath);

    } catch (err) {
        console.error('[.song] ❌ Error:', err);
        await sock.sendMessage(chatId, {
            react: { text: '⚠️', key: message.key }
        });
        await sock.sendMessage(chatId, {
            text: '❌ Failed to download the song. Please try again later.'
        }, { quoted: message });
    }
}

module.exports = songCommand;
