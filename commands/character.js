const axios = require('axios');

async function characterCommand(sock, chatId, message) {
    let userToAnalyze;

    // Mention ya reply check karo
    if (message.message?.extendedTextMessage?.contextInfo?.mentionedJid?.length > 0) {
        userToAnalyze = message.message.extendedTextMessage.contextInfo.mentionedJid[0];
    } else if (message.message?.extendedTextMessage?.contextInfo?.participant) {
        userToAnalyze = message.message.extendedTextMessage.contextInfo.participant;
    }

    if (!userToAnalyze) {
        await sock.sendMessage(chatId, { 
            text: '⚠️ Barah-e-karam kisi user ko mention ya un ke message ka reply dein taake unka character analyze kiya ja sake!' 
        });
        return;
    }

    try {
        // Profile picture lo ya default do
        let profilePic;
        try {
            profilePic = await sock.profilePictureUrl(userToAnalyze, 'image');
        } catch {
            profilePic = 'https://i.imgur.com/2wzGhpF.jpeg';
        }

        const traits = [
            "ذہین 🧠", "تخلیقی 🎨", "پرجوش 🔥", "مخلص ❤️", "دوستانہ 😊",
            "بہادر 🛡️", "سچا 💯", "ہمدرد 🤗", "محنتی 💪", "بااعتماد 🤝",
            "مزاحیہ 😂", "دلچسپ 😎", "سمجھدار 🧘", "وفادار 🐾", "عقلمند 🦉"
        ];

        // 3-5 traits chunein
        const numTraits = Math.floor(Math.random() * 3) + 3;
        const selectedTraits = [];
        for (let i = 0; i < numTraits; i++) {
            const randomTrait = traits[Math.floor(Math.random() * traits.length)];
            if (!selectedTraits.includes(randomTrait)) {
                selectedTraits.push(randomTrait);
            }
        }

        // Har trait ka random % nikalain
        const traitPercentages = selectedTraits.map(trait => {
            const percentage = Math.floor(Math.random() * 41) + 60;
            return `${trait}: ${percentage}%`;
        });

        // Final message
        const analysis = `🔮 *Character Analysis* 🔮\n\n` +
            `👤 *User:* ${userToAnalyze.split('@')[0]}\n\n` +
            `✨ *Khaas Khususiyaat:*\n${traitPercentages.join('\n')}\n\n` +
            `🎯 *Overall Rating:* ${Math.floor(Math.random() * 21) + 80}%\n\n` +
            `📌 Yeh aik fun analysis hai — maze ke liye hai, dil pe mat lena! 😄`;

        // Send karo profile pic ke sath
        await sock.sendMessage(chatId, {
            image: { url: profilePic },
            caption: analysis,
            mentions: [userToAnalyze]
        });

    } catch (error) {
        console.error('Character command error:', error);
        await sock.sendMessage(chatId, { 
            text: '❌ Character analyze karne mein masla hua! Baad mein dobara try karo.'
        });
    }
}

module.exports = characterCommand;
