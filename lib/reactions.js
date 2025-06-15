const fs = require('fs');
const path = require('path');

// Emojis for reaction
const commandEmojis = ['✨', '⚡', '🔥', '💥', '🌟', '🎯', '🚀', '🎉', '💫'];
const CONFIG_PATH = path.join(__dirname, '../data/autoreact.json');

// Ensure config file exists
if (!fs.existsSync(CONFIG_PATH)) {
    fs.writeFileSync(CONFIG_PATH, JSON.stringify({ enabled: true }, null, 2));
}

// Load current state
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

// Save state
function saveAutoReact(state) {
    try {
        fs.writeFileSync(CONFIG_PATH, JSON.stringify({ enabled: state }, null, 2));
    } catch (err) {
        console.error('[AutoReact] Save failed:', err);
    }
}

let isAutoReactionEnabled = loadAutoReact();

// Random emoji picker
function getRandomEmoji() {
    return commandEmojis[Math.floor(Math.random() * commandEmojis.length)];
}

// ✅ Apply emoji reaction
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
        console.error('❌ [Reaction Error]:', err.message);
    }
}

// ✅ Handle `.autoreact on/off` command
async function handleAreactCommand(sock, chatId, message, isOwner) {
    try {
        if (!isOwner) {
            return await sock.sendMessage(chatId, {
                text: '🔒 *Owner-only command!*',
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
                text: '✅ *Auto-Reaction enabled globally!*\nAll command messages will now get random emojis 🚀',
                quoted: message
            });
        }

        if (toggle === 'off') {
            isAutoReactionEnabled = false;
            saveAutoReact(false);
            return await sock.sendMessage(chatId, {
                text: '🚫 *Auto-Reaction disabled globally!*\nNo emojis will be added automatically.',
                quoted: message
            });
        }

        const currentState = isAutoReactionEnabled ? '🟢 Enabled' : '🔴 Disabled';
        return await sock.sendMessage(chatId, {
            text: `📦 *Auto-Reaction Status:*\nStatus: ${currentState}\n\nUsage:\n`.concat(
                '`.autoreact on` - Enable\n',
                '`.autoreact off` - Disable'
            ),
            quoted: message
        });

    } catch (err) {
        console.error('[AutoReact Command Error]:', err);
        await sock.sendMessage(chatId, {
            text: '⚠️ *Error while toggling Auto-Reaction*\nPlease try again.',
            quoted: message
        });
    }
}

module.exports = {
    addCommandReaction,
    handleAreactCommand
};
