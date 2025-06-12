const axios = require('axios');
const { channelInfo } = require('../lib/messageConfig');

async function characterCommand(sock, chatId, message) {
    let userToAnalyze;
    
    if (message.message?.extendedTextMessage?.contextInfo?.mentionedJid?.length > 0) {
        userToAnalyze = message.message.extendedTextMessage.contextInfo.mentionedJid[0];
    } else if (message.message?.extendedTextMessage?.contextInfo?.participant) {
        userToAnalyze = message.message.extendedTextMessage.contextInfo.participant;
    }
    
    if (!userToAnalyze) {
        await sock.sendMessage(chatId, { 
            text: '⚠️ Bara-e-karam kisi ko mention karo ya unke message ka reply karo takay unka character analyze kar sako!',
            ...channelInfo 
        });
        return;
    }

    try {
        let profilePic;
        try {
            profilePic = await sock.profilePictureUrl(userToAnalyze, 'image');
        } catch {
            profilePic = 'https://i.imgur.com/2wzGhpF.jpeg';
        }

        const traits = [
            "🧠 Intelligent", "🎨 Creative", "🔥 Determined", "🚀 Ambitious", "💖 Caring",
            "✨ Charismatic", "💪 Confident", "🤗 Empathetic", "⚡ Energetic", "😄 Friendly",
            "🎁 Generous", "🤝 Honest", "😂 Humorous", "🌈 Imaginative", "🦅 Independent",
            "🔮 Intuitive", "💛 Kind", "🧩 Logical", "🐾 Loyal", "🌞 Optimistic",
            "❤️ Passionate", "⌛ Patient", "🏃 Persistent", "🔒 Reliable", "🛠️ Resourceful",
            "🤲 Sincere", "💭 Thoughtful", "🫂 Understanding", "🎭 Versatile", "🦉 Wise"
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
            const percentage = Math.floor(Math.random() * 41) + 60;
            return `${trait}: ${percentage}%`;
        });

        const analysis = `🔮 *Character Analysis* 🔮\n\n` +
            `👤 *User:* ${userToAnalyze.split('@')[0]}\n\n` +
            `✨ *Key Traits:*\n${traitPercentages.join('\n')}\n\n` +
            `🎯 *Overall Rating:* ${Math.floor(Math.random() * 21) + 80}%\n\n` +
            `Note: Yeh sirf aik mazakia analysis hai, serious mat lena!`;

        await sock.sendMessage(chatId, {
            image: { url: profilePic },
            caption: analysis,
            mentions: [userToAnalyze],
            ...channelInfo
        });

    } catch (error) {
        console.error('Character command error:', error);
        await sock.sendMessage(chatId, { 
            text: '❌ Character analyze karne mein masla hua! Baad mein dobara try karo.',
            ...channelInfo 
        });
    }
}

// Sahi tarah se export karo
module.exports = characterCommand;
