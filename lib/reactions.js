const fs = require('fs');
const path = require('path');

// 🔁 Emojis used in auto-reaction
const commandEmojis = ['✨', '⚡', '🔥', '💥', '🌟', '🎯', '🚀', '🎉', '💫'];
const CONFIG_PATH = path.join(__dirname, '../data/autoreact.json');

// ✅ Create default config if missing
if (!fs.existsSync(CONFIG_PATH)) {
    fs.writeFileSync(CONFIG_PATH, JSON.stringify({ enabled: true }, null, 2));
}

// 🔄 Load auto-reaction state
function loadAutoReact() {
    try {
        const raw = fs.readFileSync(CONFIG_PATH);
        const data = JSON.parse(raw);
        return data.enabled;
    } catch (err) {
        console.error('[AutoReact] Load failed:', err);
        return false;
    }
}

// 💾 Save auto-reaction state
function saveAutoReact(state) {
    try {
        fs.writeFileSync(CONFIG_PATH, JSON.stringify({ enabled: state }, null, 2));
    } catch (err) {
        console.error('[AutoReact] Save failed:', err);
    }
}

// 🔃 In-memory state
let isAutoReactionEnabled = loadAutoReact();

// 🎲 Pick random emoji
function getRandomEmoji() {
    return commandEmojis[Math.floor(Math.random() * commandEmojis.length)];
}

// ✅ Add emoji reaction to a message
async function addCommandReaction(sock, message) {
    if (!isAutoReactionEnabled || !message?.key) return;

    try {
        const emoji = getRandomEmoji();
        await sock.sendMessage(message.key.remoteJid, {
            react: {
                text: emoji,
                key: message.key
            }
        });
    } catch (err) {
        console.error('❌ [AutoReact Error]:', err.message);
    }
}

// ✅ Handle `.autoreact` command
async function handleAreactCommand(sock, chatId, message, isOwner) {
    try {
        if (!isOwner) {
            return await sock.sendMessage(chatId, {
                text: '🔒 *Only the bot owner can use this command!*',
                quoted: message
            });
        }

        const text = message.message?.conversation || message.message?.extendedTextMessage?.text || '';
        const args = text.trim().split(' ');
        const toggle = args[1]?.toLowerCase();

        if (toggle === 'on') {
            isAutoReactionEnabled = true;
            saveAutoReact(true);
            return await sock.sendMessage(chatId, {
                text: '✅ *Auto-Reaction is now enabled!*\nBot will react to all messages with emojis ✨',
                quoted: message
            });
        }

        if (toggle === 'off') {
            isAutoReactionEnabled = false;
            saveAutoReact(false);
            return await sock.sendMessage(chatId, {
                text: '🚫 *Auto-Reaction has been disabled!*\nBot will stop reacting to messages.',
                quoted: message
            });
        }

        const currentState = isAutoReactionEnabled ? '🟢 Enabled' : '🔴 Disabled';
        return await sock.sendMessage(chatId, {
            text: `📦 *Auto-Reaction Status:*\nStatus: ${currentState}\n\nCommands:\n.autoreact on\n.autoreact off`,
            quoted: message
        });

    } catch (err) {
        console.error('[AutoReact Command Error]:', err);
        await sock.sendMessage(chatId, {
            text: '⚠️ *Error while toggling Auto-Reaction*\nTry again later.',
            quoted: message
        });
    }
}

module.exports = {
    addCommandReaction,
    handleAreactCommand
};
