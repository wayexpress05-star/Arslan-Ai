const fs = require('fs');
const path = require('path');
const { Boom } = require('@hapi/boom');

// 🔥 CONFIG PATH
const CONFIG_PATH = path.join(__dirname, '../data/autoreact.json');
const DEFAULT_CONFIG = {
    enabled: true,
    mode: 'smart',
    emoji: '❤️',
    whitelist: [],
    blacklist: []
};

// 🌟 EMOJI SETS
const EMOJI_SETS = {
    standard: ['✨', '⚡', '🔥', '💥', '🌟', '🎯', '🚀', '🎉', '💫'],
    hearts: ['❤️', '🧡', '💛', '💚', '💙', '💜', '🤎', '🖤', '🤍'],
    stars: ['⭐', '🌟', '🌠', '💫', '✨', '☄️', '🌌', '🔭', '🪐']
};

// 📦 INIT CONFIG
function initConfig() {
    if (!fs.existsSync(CONFIG_PATH)) {
        fs.writeFileSync(CONFIG_PATH, JSON.stringify(DEFAULT_CONFIG, null, 2));
    }
    try {
        const current = JSON.parse(fs.readFileSync(CONFIG_PATH));
        return { ...DEFAULT_CONFIG, ...current };
    } catch (err) {
        console.error('[AUTO-REACT] Failed to read config:', err);
        return DEFAULT_CONFIG;
    }
}

class ReactionMaster {
    constructor() {
        this.config = initConfig();
        this.currentSet = EMOJI_SETS.standard;
    }

    // 💾 SAVE CONFIG
    async saveConfig() {
        try {
            await fs.promises.writeFile(CONFIG_PATH, JSON.stringify(this.config, null, 2));
        } catch (err) {
            console.error('[AUTO-REACT] Save failed:', err);
            throw new Boom('Failed to save config');
        }
    }

    getSmartEmoji(message) {
        if (!message?.message) return this.config.emoji;
        const msgText = message.message.conversation || '';
        if (msgText.includes('?')) return '🤔';
        if (msgText.includes('!')) return '❗';
        if (msgText.length > 50) return '📝';
        return this.currentSet[Math.floor(Math.random() * this.currentSet.length)];
    }

    getReactionEmoji(message) {
        switch (this.config.mode) {
            case 'fixed': return this.config.emoji;
            case 'smart': return this.getSmartEmoji(message);
            case 'random':
            default: return this.currentSet[Math.floor(Math.random() * this.currentSet.length)];
        }
    }

    // 🚀 MAIN REACTION
    async addReaction(sock, message) {
        // 🔁 Reload config every time
        try {
            this.config = JSON.parse(fs.readFileSync(CONFIG_PATH));
        } catch (err) {
            console.error('[AUTO-REACT] Reload failed:', err);
            return false;
        }

        if (!this.config.enabled) {
            console.log("🔕 AutoReaction is OFF");
            return false;
        }

        if (!message?.key) return false;
        const sender = message.key.remoteJid;

        if (this.config.blacklist.includes(sender)) return false;
        if (this.config.whitelist.length > 0 && !this.config.whitelist.includes(sender)) return false;

        try {
            const emoji = this.getReactionEmoji(message);
            await sock.sendMessage(sender, {
                react: { text: emoji, key: message.key }
            });
            return true;
        } catch (err) {
            console.error('[AUTO-REACT] Reaction failed:', err);
            return false;
        }
    }

    // 🛠️ COMMAND HANDLER
    async handleCommand(sock, chatId, message, isOwner) {
        if (!isOwner) {
            await sock.sendMessage(chatId, {
                text: '🚫 *Owner Only Command*',
                quoted: message
            });
            return;
        }

        const text = message.message?.conversation || '';
        const args = text.trim().split(' ');

        try {
            switch (args[1]?.toLowerCase()) {
                case 'on':
                    this.config.enabled = true;
                    await this.saveConfig();
                    await sock.sendMessage(chatId, {
                        text: '✅ *Auto-Reaction ON*',
                        quoted: message
                    });
                    break;

                case 'off':
                    this.config.enabled = false;
                    await this.saveConfig();
                    await sock.sendMessage(chatId, {
                        text: '❌ *Auto-Reaction OFF*',
                        quoted: message
                    });
                    break;

                case 'mode':
                    if (['smart', 'random', 'fixed'].includes(args[2])) {
                        this.config.mode = args[2];
                        await this.saveConfig();
                        await sock.sendMessage(chatId, {
                            text: `♻️ *Mode Set to:* ${args[2].toUpperCase()}`,
                            quoted: message
                        });
                    } else {
                        await sock.sendMessage(chatId, {
                            text: `📛 Invalid Mode!\nChoose: smart / random / fixed\nCurrent: ${this.config.mode}`,
                            quoted: message
                        });
                    }
                    break;

                case 'set':
                    if (args[2] && EMOJI_SETS[args[2]]) {
                        this.currentSet = EMOJI_SETS[args[2]];
                        await sock.sendMessage(chatId, {
                            text: `🎨 *Emoji Set Updated to:* ${args[2].toUpperCase()}`,
                            quoted: message
                        });
                    } else {
                        const sets = Object.keys(EMOJI_SETS).join(', ');
                        await sock.sendMessage(chatId, {
                            text: `🛑 Invalid Emoji Set!\nAvailable: ${sets}`,
                            quoted: message
                        });
                    }
                    break;

                default:
                    const status = this.config.enabled ? '🟢 ON' : '🔴 OFF';
                    await sock.sendMessage(chatId, {
                        text: `⚙️ *Auto-Reaction Settings*\n\n` +
                              `Status: ${status}\n` +
                              `Mode: ${this.config.mode.toUpperCase()}\n` +
                              `Set: ${this.currentSet[0]}...\n\n` +
                              `📌 Commands:\n` +
                              `.autoreact on / off\n` +
                              `.autoreact mode [smart/random/fixed]\n` +
                              `.autoreact set [standard/hearts/stars]`,
                        quoted: message
                    });
            }
        } catch (err) {
            console.error('[AUTO-REACT] Command Error:', err);
            await sock.sendMessage(chatId, {
                text: '💥 Command failed:\n' + err.message,
                quoted: message
            });
        }
    }
}

// 🔁 EXPORT
const reactionMaster = new ReactionMaster();
module.exports = {
    addReaction: (sock, msg) => reactionMaster.addReaction(sock, msg),
    handleCommand: (sock, chatId, msg, isOwner) => reactionMaster.handleCommand(sock, chatId, msg, isOwner)
};
