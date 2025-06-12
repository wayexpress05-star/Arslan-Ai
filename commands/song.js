const yts = require('yt-search');
const ytdl = require('ytdl-core');
const fs = require('fs-extra');
const axios = require('axios');
const path = require('path');

async function songCommand(sock, chatId, message) {
    try {
        const text = message.message?.conversation || message.message?.extendedTextMessage?.text || '';
        const query = text.split(' ').slice(1).join(' ');

        if (!query) {
            return await sock.sendMessage(chatId, {
                text: '🎵 *Usage:* `.song song name`\n\n_Example:_ `.song alone alan walker`'
            });
        }

        // Search YouTube
        const search = await yts(query);
        const video = search.videos[0];

        if (!video) {
            return await sock.sendMessage(chatId, { text: '❌ No results found!' });
        }

        const { title, url, thumbnail, duration, views } = video;
        const audioPath = path.join(__dirname, `ArslanMD_${Date.now()}.mp3`);
        const thumbPath = path.join(__dirname, `thumb_${Date.now()}.jpg`);

        // Send info before downloading
        await sock.sendMessage(chatId, {
            text: `🎧 *${title}*\n\n*Duration:* ${duration.timestamp}\n*Views:* ${views.toLocaleString()}\n\n_Downloading your song..._\n> Arslan-MD Bot`,
        });

        // Download thumbnail
        const thumb = await axios.get(thumbnail, { responseType: 'arraybuffer' });
        await fs.writeFile(thumbPath, thumb.data);

        // Download audio
        const stream = ytdl(url, { filter: 'audioonly' });
        const writer = fs.createWriteStream(audioPath);
        stream.pipe(writer);

        writer.on('finish', async () => {
            // Send audio with image preview
            await sock.sendMessage(chatId, {
                image: fs.readFileSync(thumbPath),
                caption: `🎵 *${title}*\n⏱️ Duration: ${duration.timestamp}\n🔗 ${url}`
            }, { quoted: message });

            await sock.sendMessage(chatId, {
                audio: fs.readFileSync(audioPath),
                mimetype: 'audio/mp4',
                fileName: `${title}.mp3`
            }, { quoted: message });

            // Cleanup
            fs.unlinkSync(audioPath);
            fs.unlinkSync(thumbPath);
        });

    } catch (err) {
        console.error('[.song] Error:', err);
        await sock.sendMessage(chatId, {
            text: '❌ Failed to download the song. Please try again later.'
        });
    }
}

module.exports = songCommand;
