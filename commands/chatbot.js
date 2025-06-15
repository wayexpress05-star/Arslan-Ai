const fs = require('fs');
const path = require('path');
const fetch = require('node-fetch');
const config = require('../settings');

const USER_GROUP_DATA = path.join(__dirname, '../data/userGroupData.json');
const AUTOREPLY_PATH = path.join(__dirname, '../autos/autoreply.json');

const chatMemory = {
    messages: new Map(),
    userInfo: new Map()
};

function loadUserGroupData() {
    try {
        return JSON.parse(fs.readFileSync(USER_GROUP_DATA));
    } catch {
        return { groups: [], chatbot: {} };
    }
}

function saveUserGroupData(data) {
    try {
        fs.writeFileSync(USER_GROUP_DATA, JSON.stringify(data, null, 2));
    } catch (e) {
        console.error('❌ Error saving chatbot data:', e.message);
    }
}

async function showTyping(sock, chatId) {
    try {
        await sock.presenceSubscribe(chatId);
        await sock.sendPresenceUpdate('composing', chatId);
        await new Promise(r => setTimeout(r, Math.floor(Math.random() * 3000) + 1000));
    } catch {}
}

async function handleChatbotCommand(sock, chatId, message, match) {
    const data = loadUserGroupData();
    const isGroup = chatId.endsWith('@g.us');
    const senderId = message.key.participant || message.key.remoteJid;
    const botNumber = sock.user.id.split(':')[0] + '@s.whatsapp.net';
    const isOwner = senderId === botNumber;

    if (!isGroup) {
        return await sock.sendMessage(chatId, {
            text: '*🤖 Arslan-MD Chatbot is always active in private chat.* 💬'
        }, { quoted: message });
    }

    if (!match) {
        return await sock.sendMessage(chatId, {
            text: `╭─「 *🤖 Chatbot Setup* 」\n│\n│ 💬 *.chatbot on* – Enable in group\n│ 🔇 *.chatbot off* – Disable in group\n╰───────────────⬣`
        });
    }

    if (match === 'on') {
        data.chatbot[chatId] = true;
        saveUserGroupData(data);
        return sock.sendMessage(chatId, { text: '✅ *Chatbot has been enabled in this group.*' });
    }

    if (match === 'off') {
        delete data.chatbot[chatId];
        saveUserGroupData(data);
        return sock.sendMessage(chatId, { text: '🛑 *Chatbot has been disabled for this group.*' });
    }

    return sock.sendMessage(chatId, { text: '*Invalid command. Use:* .chatbot on / off' });
}

async function handleChatbotResponse(sock, chatId, message, userMessage, senderId) {
    const data = loadUserGroupData();
    const isGroup = chatId.endsWith('@g.us');

    if (isGroup && !data.chatbot[chatId]) return;

    // ✅ Check autoreply.json first
    if (config.AUTO_REPLY === 'true') {
        try {
            const replyMap = JSON.parse(fs.readFileSync(AUTOREPLY_PATH, 'utf-8'));
            const lowerMsg = userMessage.trim().toLowerCase();

            if (replyMap[lowerMsg]) {
                await showTyping(sock, chatId);
                return await sock.sendMessage(chatId, {
                    text: replyMap[lowerMsg],
                    quoted: message
                });
            }
        } catch (err) {
            console.error('❌ Error loading autoreply.json:', err.message);
        }
    }

    // 🧠 AI fallback
    const cleaned = userMessage;
    if (!chatMemory.messages.has(senderId)) {
        chatMemory.messages.set(senderId, []);
        chatMemory.userInfo.set(senderId, {});
    }

    const messages = chatMemory.messages.get(senderId);
    messages.push(cleaned);
    if (messages.length > 20) messages.shift();
    chatMemory.messages.set(senderId, messages);

    await showTyping(sock, chatId);

    const response = await getAIResponse(cleaned, {
        messages: chatMemory.messages.get(senderId),
        userInfo: chatMemory.userInfo.get(senderId)
    });

    if (response) {
        await sock.sendMessage(chatId, {
            text: `🧠 *Arslan-MD Replied:*\n\n${response}\n\n💡 _AI Powered by ArslanMD Official_`,
            quoted: message
        });
    }
}

async function getAIResponse(userMessage, context) {
    try {
        const prompt = `User: ${userMessage}\n\nChat history:\n${context.messages.join('\n')}`;
        const res = await fetch("https://api.dreaded.site/api/chatgpt?text=" + encodeURIComponent(prompt));
        const json = await res.json();
        return json.result?.prompt || null;
    } catch {
        return null;
    }
}

module.exports = {
    handleChatbotCommand,
    handleChatbotResponse
};
