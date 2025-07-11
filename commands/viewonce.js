const { downloadContentFromMessage } = require('@whiskeysockets/baileys');
const fs = require('fs');
const path = require('path');
const settings = require('../settings');

const channelInfo = {
    contextInfo: {
        forwardingScore: 1,
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
            newsletterJid: '120363348739987203@newsletter',
            newsletterName: settings.botName || 'Arslan-Ai',
            serverMessageId: -1
        }
    }
};

async function viewOnceCommand(sock, chatId, message) {
    try {
        const quoted = message.message?.extendedTextMessage?.contextInfo?.quotedMessage;

        if (!quoted) {
            return await sock.sendMessage(chatId, {
                text: '❌ Reply to a *view once* image or video!',
                ...channelInfo
            });
        }

        const imageView = quoted?.viewOnceMessage?.message?.imageMessage;
        const videoView = quoted?.viewOnceMessage?.message?.videoMessage;
        const media = imageView || videoView;

        if (!media) {
            return await sock.sendMessage(chatId, {
                text: '❌ This is *not* a view once message!',
                ...channelInfo
            });
        }

        const caption = media.caption || '';

        if (imageView) {
            const stream = await downloadContentFromMessage(media, 'image');
            let buffer = Buffer.from([]);
            for await (const chunk of stream) buffer = Buffer.concat([buffer, chunk]);

            return await sock.sendMessage(chatId, {
                image: buffer,
                caption: `*💀 ${settings.botName} Anti ViewOnce 💀*\n\n*Type:* Image 📸\n${caption ? `*Caption:* ${caption}` : ''}`,
                ...channelInfo
            });
        }

        if (videoView) {
            const tempDir = path.join(__dirname, '../temp');
            if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir);

            const filePath = path.join(tempDir, `viewonce_${Date.now()}.mp4`);
            const stream = await downloadContentFromMessage(media, 'video');
            const writer = fs.createWriteStream(filePath);

            for await (const chunk of stream) writer.write(chunk);
            writer.end();
            await new Promise(resolve => writer.on('finish', resolve));

            await sock.sendMessage(chatId, {
                video: fs.readFileSync(filePath),
                caption: `*💀 ${settings.botName} Anti ViewOnce 💀*\n\n*Type:* Video 📹\n${caption ? `*Caption:* ${caption}` : ''}`,
                ...channelInfo
            });

            fs.unlinkSync(filePath);
        }

    } catch (err) {
        console.error('❌ ViewOnce Error:', err);
        await sock.sendMessage(chatId, {
            text: '❌ Failed to process view once message!\nError: ' + err.message,
            ...channelInfo
        });
    }
}

module.exports = viewOnceCommand;
