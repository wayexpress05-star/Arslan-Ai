const yts = require('yt-search');
const ytdl = require('ytdl-core');
const fs = require('fs-extra');
const axios = require('axios');
const path = require('path');

async function playCommand(sock, chatId, message) {
    try {
        const text = message.message?.conversation || message.message?.extendedTextMessage?.text || '';
        const query = text.split(' ').slice(1).join(' ');

        if (!query) {
            return await sock.sendMessage(chatId, {
                text: '🎧 *Usage:* `.play song name`\n\n_Example:_ `.play shape of you`'
            });
        }

        // Search YouTube
        const search = await yts(query);
        const video = search.videos[0];

        if (!video) {
            return await sock.sendMessage(chatId, { text: '❌ No results found!' });
        }

        const { title, url, thumbnail, duration, author } = video;
        const audioPath = path.join(__dirname, `ArslanMD_${Date.now()}.mp3`);
        const thumbPath = path.join(__dirname, `thumb_${Date.now()}.jpg`);

        // Notify downloading
        await sock.sendMessage(chatId, {
            text: `🔎 *Title:* ${title}\n⏱️ *Duration:* ${duration.timestamp}\n📥 *Downloading...*`
        });

        // Download thumbnail
        const thumb = await axios.get(thumbnail, { responseType: 'arraybuffer' });
        await fs.writeFile(thumbPath, thumb.data);

        // Download audio
        const stream = ytdl(url, { filter: 'audioonly' });
        const writer = fs.createWriteStream(audioPath);
        stream.pipe(writer);

        writer.on('finish', async () => {
            // Send audio with thumbnail preview
            await sock.sendMessage(chatId, {
                image: fs.readFileSync(thumbPath),
                caption: `🎵 *${title}*\n🎤 *By:* ${author.name}\n⏱️ *Duration:* ${duration.timestamp}\n🔗 *Link:* ${url}\n\n🎧 _Powered by ArslanMD_`
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
        console.error('[.play] Error:', err);
        await sock.sendMessage(chatId, {
            text: '❌ Failed to download the song. Please try again later.'
        });
    }
}

module.exports = playCommand;

/*
🔥 Enhanced by ArslanMD | Audio + Thumbnail + Info
*/
