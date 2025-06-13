const fs = require('fs');
const path = require('path');
const settings = require('../settings');
const webp = require('node-webpmux');
const { exec } = require('child_process');
const crypto = require('crypto');

// Sticker Command
async function stickerCommand(sock, chatId, message) {
    let mediaMessage;

    // Check if there is a quoted media message
    if (message.message?.extendedTextMessage?.contextInfo?.quotedMessage) {
        const quoted = message.message.extendedTextMessage.contextInfo;
        mediaMessage = quoted.quotedMessage.imageMessage || quoted.quotedMessage.videoMessage || quoted.quotedMessage.documentMessage;

        message = {
            key: {
                remoteJid: chatId,
                fromMe: false,
                id: quoted.stanzaId,
                participant: quoted.participant || chatId
            },
            message: quoted.quotedMessage
        };
    } else {
        mediaMessage = message.message?.imageMessage || message.message?.videoMessage || message.message?.documentMessage;
    }

    if (!mediaMessage) {
        await sock.sendMessage(chatId, { 
            text: 'Please reply to an image, video or GIF to create a sticker.',
            contextInfo: {
                forwardingScore: 999,
                isForwarded: true
            }
        }, { quoted: message });
        return;
    }

    try {
        const mediaBuffer = await downloadMediaMessage(message, 'buffer', {}, { 
            logger: undefined, 
            reuploadRequest: sock.updateMediaMessage 
        });

        if (!mediaBuffer) {
            await sock.sendMessage(chatId, { 
                text: 'Failed to download media. Please try again.',
                contextInfo: {
                    forwardingScore: 999,
                    isForwarded: true
                }
            });
            return;
        }

        // Create temp directory
        const tmpDir = path.join(process.cwd(), 'tmp');
        if (!fs.existsSync(tmpDir)) {
            fs.mkdirSync(tmpDir, { recursive: true });
        }

        // Temp files
        const tempInput = path.join(tmpDir, `temp_${Date.now()}`);
        const tempOutput = path.join(tmpDir, `sticker_${Date.now()}.webp`);

        fs.writeFileSync(tempInput, mediaBuffer);

        const isAnimated = mediaMessage.mimetype?.includes('gif') || mediaMessage.mimetype?.includes('video') || mediaMessage.seconds > 0;

        // Convert media to webp
        const ffmpegCommand = isAnimated
            ? `ffmpeg -i "${tempInput}" -vf "scale=512:512:force_original_aspect_ratio=decrease,fps=15,pad=512:512:(ow-iw)/2:(oh-ih)/2:color=#00000000" -c:v libwebp -preset default -loop 0 -vsync 0 -pix_fmt yuva420p -quality 75 -compression_level 6 "${tempOutput}"`
            : `ffmpeg -i "${tempInput}" -vf "scale=512:512:force_original_aspect_ratio=decrease,format=rgba,pad=512:512:(ow-iw)/2:(oh-ih)/2:color=#00000000" -c:v libwebp -preset default -loop 0 -vsync 0 -pix_fmt yuva420p -quality 75 -compression_level 6 "${tempOutput}"`;

        await new Promise((resolve, reject) => {
            exec(ffmpegCommand, (error) => {
                if (error) {
                    console.error('FFmpeg error:', error);
                    reject(error);
                } else resolve();
            });
        });

        // Read WebP file
        const webpBuffer = fs.readFileSync(tempOutput);

        // Add metadata using webpmux
        const img = new webp.Image();
        await img.load(webpBuffer);

        // Create EXIF metadata
        const json = {
            'sticker-pack-id': crypto.randomBytes(32).toString('hex'),
            'sticker-pack-name': settings.packname || 'Arslan-MD',
            'emojis': ['🤖']
        };

        const exifAttr = Buffer.from([0x49, 0x49, 0x2A, 0x00, 0x08, 0x00, 0x00, 0x00, 0x01, 0x00, 0x41, 0x57, 0x07, 0x00, 0x00, 0x00, 0x00, 0x00, 0x16, 0x00, 0x00, 0x00]);
        const jsonBuffer = Buffer.from(JSON.stringify(json), 'utf8');
        const exif = Buffer.concat([exifAttr, jsonBuffer]);
        exif.writeUIntLE(jsonBuffer.length, 14, 4);

        img.exif = exif;

        // Final buffer with metadata
        const finalBuffer = await img.save(null);

        // Send Sticker
        await sock.sendMessage(chatId, { 
            sticker: finalBuffer
        }, { quoted: message });

        // Cleanup temp files
        try {
            fs.unlinkSync(tempInput);
            fs.unlinkSync(tempOutput);
        } catch (err) {
            console.error('Error cleaning up temp files:', err);
        }

    } catch (error) {
        console.error('Error in sticker command:', error);
        await sock.sendMessage(chatId, { 
            text: 'Failed to create sticker! Try again later.',
            contextInfo: {
                forwardingScore: 999,
                isForwarded: true
            }
        });
    }
}

module.exports = stickerCommand;
