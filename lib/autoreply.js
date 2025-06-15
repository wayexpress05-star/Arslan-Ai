const fs = require('fs');
const path = require('path');
const config = require('../settings');

const AUTOREPLY_PATH = path.join(__dirname, '../autos/autoreply.json');

// Load auto-reply data
function loadAutoReplyData() {
    try {
        const data = fs.readFileSync(AUTOREPLY_PATH, 'utf-8');
        return JSON.parse(data);
    } catch (err) {
        console.error('❌ Error loading autoreply.json:', err.message);
        return {};
    }
}

// Handler
async function handleAutoReply(sock, chatId, message, userMessage) {
    try {
        if (config.AUTO_REPLY !== 'true') return;

        const replies = loadAutoReplyData();
        const cleaned = userMessage.trim().toLowerCase();

        if (replies[cleaned]) {
            await sock.presenceSubscribe(chatId);
            await sock.sendPresenceUpdate('composing', chatId);
            await new Promise(r => setTimeout(r, 800));

            return await sock.sendMessage(chatId, {
                text: replies[cleaned],
                quoted: message
            });
        }
    } catch (err) {
        console.error('❌ Auto-reply error:', err.message);
    }
}

module.exports = {
    handleAutoReply
};
