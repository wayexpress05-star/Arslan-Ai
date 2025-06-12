const axios = require('axios');
const { channelInfo } = require('../lib/messageConfig');

module.exports = {
    command: 'character',
    description: 'Analyze user character',
    category: 'fun',
    use: '[mention/reply]',
    async handler(m, { conn, args }) {
        let userToAnalyze;

        // Mention or reply check
        if (m.mentionedJid?.length > 0) {
            userToAnalyze = m.mentionedJid[0];
        } else if (m.quoted) {
            userToAnalyze = m.quoted.sender;
        }

        if (!userToAnalyze) {
            return conn.sendMessage(m.chat, {
                text: '⚠️ *Please mention someone or reply to their message to analyze their character!*',
                ...channelInfo
            }, { quoted: m });
        }

        try {
            // Profile picture
            let profilePic;
            try {
                profilePic = await conn.profilePictureUrl(userToAnalyze, 'image');
            } catch {
                profilePic = 'https://i.imgur.com/2wzGhpF.jpeg';
            }

            const traits = [
                "🧠 Intelligent", "🎨 Creative", "🔥 Determined", "🚀 Ambitious", "💖 Caring",
                "🌟 Charismatic", "💪 Confident", "🤝 Empathetic", "⚡ Energetic", "😊 Friendly",
                "🎁 Generous", "✅ Honest", "😂 Humorous", "🌈 Imaginative", "🙌 Independent",
                "🔮 Intuitive", "🌼 Kind", "📐 Logical", "🛡️ Loyal", "☀️ Optimistic",
                "❤️‍🔥 Passionate", "⏳ Patient", "🏃 Persistent", "🔧 Reliable", "🧰 Resourceful",
                "🎯 Sincere", "🧠 Thoughtful", "🤗 Understanding", "🎭 Versatile", "🦉 Wise"
            ];

            const numTraits = Math.floor(Math.random() * 3) + 3;
            const selectedTraits = [];

            while (selectedTraits.length < numTraits) {
                const randomTrait = traits[Math.floor(Math.random() * traits.length)];
                if (!selectedTraits.includes(randomTrait)) {
                    selectedTraits.push(randomTrait);
                }
            }

            const traitPercentages = selectedTraits.map(trait => {
                const percentage = Math.floor(Math.random() * 41) + 60; // 60-100
                return `🔹 ${trait}: *${percentage}%*`;
            });

            const analysis = `🔮 *Character Analysis* 🔮\n\n` +
                `👤 *User:* @${userToAnalyze.split('@')[0]}\n\n` +
                `✨ *Key Traits:*\n${traitPercentages.join('\n')}\n\n` +
                `📊 *Overall Rating:* *${Math.floor(Math.random() * 21) + 80}%*\n\n` +
                `📝 _Note: This is a fun analysis and should not be taken seriously!_`;

            await conn.sendMessage(m.chat, {
                image: { url: profilePic },
                caption: analysis,
                mentions: [userToAnalyze],
                ...channelInfo
            }, { quoted: m });

        } catch (err) {
            console.error('Character command error:', err);
            await conn.sendMessage(m.chat, {
                text: '❌ *Failed to analyze character. Please try again later!*',
                ...channelInfo
            }, { quoted: m });
        }
    }
};
