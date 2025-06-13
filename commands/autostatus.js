const fs = require('fs');
const path = require('path');

// 🔐 File path for config
const configPath = path.join(__dirname, '../data/autoStatus.json');

// 📌 Initialize config if missing
if (!fs.existsSync(configPath)) {
    fs.writeFileSync(configPath, JSON.stringify({ enabled: false }, null, 2));
}

// 🔄 Toggle Auto Status
async function autoStatusCommand(sock, chatId, msg, args) {
    try {
        const isOwner = msg.key.fromMe;
        if (!isOwner) {
            return await sock.sendMessage(chatId, {
                text: '🚫 Only *Bot Owner* can use this command!'
            });
        }

        let config = JSON.parse(fs.readFileSync(configPath));

        if (!args || args.length === 0) {
            const status = config.enabled ? '🟢 Enabled' : '🔴 Disabled';
            return await sock.sendMessage(chatId, {
                text: `🧠 *Auto Status Feature*\n\nCurrent Status: ${status}\n\n📌 Commands:\n.autostatus on  ✅ Enable\n.autostatus off ❌ Disable`
            });
        }

        const command = args[0].toLowerCase();
        if (command === 'on') {
            config.enabled = true;
            fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
            return await sock.sendMessage(chatId, {
                text: '✅ *Auto status view is now ENABLED!*\nBot will automatically view all contact statuses.\n\n📢 *Powered by Arslan-MD Official*'
            });
        } else if (command === 'off') {
            config.enabled = false;
            fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
            return await sock.sendMessage(chatId, {
                text: '❌ *Auto status view is now DISABLED!*\nBot will no longer view contact statuses.'
            });
        } else {
            return await sock.sendMessage(chatId, {
                text: '⚠️ Invalid argument!\nUse `.autostatus on` or `.autostatus off`'
            });
        }

    } catch (error) {
        console.error('❌ AutoStatus Error:', error.message);
        await sock.sendMessage(chatId, {
            text: `❌ An error occurred:\n${error.message}`
        });
    }
}

// ✅ Helper: Check status toggle
function isAutoStatusEnabled() {
    try {
        const config = JSON.parse(fs.readFileSync(configPath));
        return config.enabled;
    } catch {
        return false;
    }
}

// 👁️ Status update handler
async function handleStatusUpdate(sock, status) {
    if (!isAutoStatusEnabled()) return;

    try {
        await new Promise(resolve => setTimeout(resolve, 1000)); // slight delay

        const key = status.key || status.messages?.[0]?.key || status.reaction?.key;
        if (!key || key.remoteJid !== 'status@broadcast') return;

        await sock.readMessages([key]);
        const sender = key.participant || key.remoteJid;
        console.log(`👁️ Viewed status from: ${sender.split('@')[0]}`);

        // 🧠 Optional: Add autoreact feature here if needed

    } catch (err) {
        if (err.message?.includes('rate-overlimit')) {
            console.warn('⚠️ Rate limit hit! Retrying...');
            await new Promise(resolve => setTimeout(resolve, 2000));
            await sock.readMessages([status.key]);
        } else {
            console.error('❌ Status Error:', err.message);
        }
    }
}

module.exports = {
    autoStatusCommand,
    handleStatusUpdate
};
