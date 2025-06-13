const fs = require('fs');
const path = require('path');

// 📁 Auto Status Configuration File
const configPath = path.join(__dirname, '../data/autoStatus.json');

// ⚙️ Initialize file if missing
if (!fs.existsSync(configPath)) {
    fs.writeFileSync(configPath, JSON.stringify({ enabled: false }, null, 2));
}

// 📍 Toggle Command Handler
async function autoStatusCommand(sock, chatId, msg, args) {
    try {
        const sender = msg.key.participant || msg.key.remoteJid;

        if (!msg.key.fromMe) {
            return await sock.sendMessage(chatId, {
                text: '🚫 *Owner Only!*\nThis command is only for the bot owner.',
                quoted: msg
            });
        }

        const config = JSON.parse(fs.readFileSync(configPath));

        if (!args || args.length === 0) {
            const status = config.enabled ? '🟢 *Enabled*' : '🔴 *Disabled*';
            return await sock.sendMessage(chatId, {
                text: `🛰️ *Auto Status Viewer*\n\nCurrent Status: ${status}\n\n✅ Use:\n*.autostatus on* – Enable auto-view\n*.autostatus off* – Disable auto-view`,
                quoted: msg
            });
        }

        const command = args[0].toLowerCase();

        if (command === 'on') {
            config.enabled = true;
            fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
            await sock.sendMessage(chatId, {
                text: `✅ *Auto Status Enabled!*\nBot will now automatically view all contact status updates.`,
                quoted: msg
            });
        } else if (command === 'off') {
            config.enabled = false;
            fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
            await sock.sendMessage(chatId, {
                text: `🚫 *Auto Status Disabled!*\nBot will no longer auto-view statuses.`,
                quoted: msg
            });
        } else {
            await sock.sendMessage(chatId, {
                text: `❌ *Invalid Option!*\n\nUse:\n.autostatus on\n.autostatus off`,
                quoted: msg
            });
        }

    } catch (error) {
        console.error('❌ autostatus error:', error.message);
        await sock.sendMessage(chatId, {
            text: `⚠️ *Unexpected Error:*\n${error.message}`,
            quoted: msg
        });
    }
}

// 🔁 Status Handler Function
function isAutoStatusEnabled() {
    try {
        const config = JSON.parse(fs.readFileSync(configPath));
        return config.enabled;
    } catch (error) {
        console.error('❌ Status Config Read Error:', error.message);
        return false;
    }
}

// 📡 Auto View Status Updates
async function handleStatusUpdate(sock, status) {
    if (!isAutoStatusEnabled()) return;

    try {
        await new Promise(r => setTimeout(r, 1000)); // Small delay

        const key = status?.key || status?.messages?.[0]?.key || status?.reaction?.key;
        if (key?.remoteJid !== 'status@broadcast') return;

        await sock.readMessages([key]);

        const sender = key.participant || key.remoteJid;
        const jid = sender?.split('@')[0] || 'unknown';
        console.log(`👀 Auto-viewed status from: ${jid}`);

    } catch (err) {
        if (err.message?.includes('rate-overlimit')) {
            console.warn('⚠️ Rate limit hit! Retrying...');
            await new Promise(r => setTimeout(r, 2000));
            try {
                const key = status?.key || status?.messages?.[0]?.key || status?.reaction?.key;
                await sock.readMessages([key]);
            } catch (e) {
                console.error('❌ Retry failed:', e.message);
            }
        } else {
            console.error('❌ Error viewing status:', err.message);
        }
    }
}

module.exports = {
    autoStatusCommand,
    handleStatusUpdate
};
