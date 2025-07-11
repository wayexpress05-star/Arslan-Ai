const { downloadContentFromMessage } = require('@whiskeysockets/baileys');
const fs = require('fs');
const path = require('path');
const { cmd } = require('../command'); // ✅ plugin system

// 📢 Channel info
const channelInfo = {
    contextInfo: {
        forwardingScore: 1,
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
            newsletterJid: '120363348739987203@newsletter',
            newsletterName: 'Arslan-Ai',
            serverMessageId: -1
        }
    }
};

// ✅ Register command here
cmd({
    pattern: "viewonce", // 🟢 Change this to any command like "antivo"
    alias: ["antivo", "vonce"], // optional: aliases
    desc: "Break view once image/video",
    category: "tools",
    react: "💀",
    filename: __filename
}, async (sock, message, { chatId }) => {
    try {
        const quoted = message.message?.extendedTextMessage?.contextInfo?.quotedMessage ||
                       message.message?.imageMessage ||
                       message.message?.videoMessage;

        if (!quoted) {
            return await sock.sendMessage(chatId, { text: '❌ Reply to a view once message!', ...channelInfo });
        }

        const imageView = quoted.imageMessage?.viewOnce === true || 
                          quoted.viewOnceMessage?.message?.imageMessage ||
                          message.message?.viewOnceMessage?.message?.imageMessage;

        const videoView = quoted.videoMessage?.viewOnce === true || 
                          quoted.viewOnceMessage?.message?.videoMessage ||
                          message.message?.viewOnceMessage?.message?.videoMessage;

        let media = imageView
            ? quoted.imageMessage || quoted.viewOnceMessage?.message?.imageMessage || message.message?.viewOnceMessage?.message?.imageMessage
            : videoView
            ? quoted.videoMessage || quoted.viewOnceMessage?.message?.videoMessage || message.message?.viewOnceMessage?.message?.videoMessage
            : null;

        if (!media) {
            return await sock.sendMessage(chatId, { text: '❌ Not a view once message!', ...channelInfo });
        }

        const caption = media.caption || '';

        if (imageView) {
            const stream = await downloadContentFromMessage(media, 'image');
            let buffer = Buffer.from([]);
            for await (const chunk of stream) buffer = Buffer.concat([buffer, chunk]);

            return await sock.sendMessage(chatId, {
                image: buffer,
                caption: `*💀 Arslan-Ai Anti ViewOnce 💀*\n\n*Type:* Image 📸\n${caption ? `*Caption:* ${caption}` : ''}`,
                ...channelInfo
            });
        }

        if (videoView) {
            const tempDir = path.join(__dirname, '../temp');
            if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir);

            const filePath = path.join(tempDir, `vo_${Date.now()}.mp4`);
            const stream = await downloadContentFromMessage(media, 'video');
            const writer = fs.createWriteStream(filePath);

            for await (const chunk of stream) writer.write(chunk);
            writer.end();
            await new Promise(resolve => writer.on('finish', resolve));

            await sock.sendMessage(chatId, {
                video: fs.readFileSync(filePath),
                caption: `*💀 Arslan-Ai Anti ViewOnce 💀*\n\n*Type:* Video 📹\n${caption ? `*Caption:* ${caption}` : ''}`,
                ...channelInfo
            });

            fs.unlinkSync(filePath); // Cleanup
        }

    } catch (e) {
        console.error("❌ ViewOnce error:", e);
        await sock.sendMessage(chatId, {
            text: '❌ Failed to break view once!\nError: ' + e.message,
            ...channelInfo
        });
    }
});

module.exports = viewOnceCommand; 
