const axios = require('axios');
const fetch = require('node-fetch');
const fs = require('fs');
const path = require('path');

async function aiCommand(sock, chatId, message) {
    try {
        const textMsg = message.message?.conversation ||
                        message.message?.extendedTextMessage?.text ||
                        message.message?.imageMessage?.caption ||
                        message.message?.videoMessage?.caption;

        if (!textMsg) {
            return await sock.sendMessage(chatId, {
                text: "❌ *Please provide a prompt!*\n\nExample:\n.gpt What is artificial intelligence?"
            }, { quoted: message });
        }

        const [command, ...rest] = textMsg.trim().split(" ");
        const query = rest.join(" ");

        if (!query) {
            return await sock.sendMessage(chatId, {
                text: "⚠️ *Please write something after the command.*\nExample:\n.gemini write a short story"
            }, { quoted: message });
        }

        // 📎 Load a sticker to show AI is processing
        const stickerPath = path.join(__dirname, '../assets/loading.webp');
        if (fs.existsSync(stickerPath)) {
            await sock.sendMessage(chatId, {
                sticker: fs.readFileSync(stickerPath)
            }, { quoted: message });
        }

        // 🤖 React emoji
        await sock.sendMessage(chatId, {
            react: { text: '🤖', key: message.key }
        });

        // 🤖 GPT Section
        if (command === '.gpt') {
            const res = await axios.get(`https://api.dreaded.site/api/chatgpt?text=${encodeURIComponent(query)}`);
            const replyText = res.data?.result?.prompt || res.data?.result || res.data?.message;

            if (replyText) {
                return await sock.sendMessage(chatId, {
                    text: `🤖 *GPT-3.5 Response:*\n\n🧠 ${replyText.trim()}`
                }, { quoted: message });
            } else {
                throw new Error("GPT API gave empty response.");
            }
        }

        // 🌐 Gemini Section
        if (command === '.gemini') {
            const apis = [
                `https://vapis.my.id/api/gemini?q=${encodeURIComponent(query)}`,
                `https://api.siputzx.my.id/api/ai/gemini-pro?content=${encodeURIComponent(query)}`,
                `https://api.ryzendesu.vip/api/ai/gemini?text=${encodeURIComponent(query)}`,
                `https://api.dreaded.site/api/gemini2?text=${encodeURIComponent(query)}`,
                `https://api.giftedtech.my.id/api/ai/geminiai?apikey=gifted&q=${encodeURIComponent(query)}`,
                `https://api.giftedtech.my.id/api/ai/geminiaipro?apikey=gifted&q=${encodeURIComponent(query)}`
            ];

            for (const api of apis) {
                try {
                    const res = await fetch(api);
                    const data = await res.json();

                    const replyText = data.result || data.answer || data.message || data.data;

                    if (replyText) {
                        return await sock.sendMessage(chatId, {
                            text: `🌐 *Gemini Response:*\n\n📘 ${replyText.trim()}`
                        }, { quoted: message });
                    }
                } catch (e) {
                    continue;
                }
            }

            throw new Error("All Gemini APIs failed.");
        }

    } catch (err) {
        console.error("❌ AI Error:", err.message);
        await sock.sendMessage(chatId, {
            text: `❌ *AI Error:*\n${err.message || "Something went wrong, please try again."}`
        }, { quoted: message });
    }
}

module.exports = aiCommand;
