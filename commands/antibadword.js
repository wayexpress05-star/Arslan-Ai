const { handleAntiBadwordCommand } = require('../lib/antibadword');
const isAdminHelper = require('../lib/isAdmin');

async function antibadwordCommand(sock, chatId, message, senderId, isSenderAdmin) {
    try {
        const text = message.message?.conversation || message.message?.extendedTextMessage?.text || '';
        const match = text.split(' ').slice(1).join(' ').trim();

        // 👮‍♂️ Check if sender is group admin
        if (!isSenderAdmin) {
            await sock.sendMessage(chatId, {
                text: '🚫 *Permission Denied!*\n\nOnly *group admins* can use the `.antibadword` command.',
                quoted: message
            });
            return;
        }

        // ⚙️ Show processing feedback
        await sock.sendMessage(chatId, {
            react: { text: "🧠", key: message.key }
        });

        // 🧹 Call main handler logic
        await handleAntiBadwordCommand(sock, chatId, message, match);

        // ✅ Confirm setup/update
        await sock.sendMessage(chatId, {
            text: `✅ *Anti-Badword updated successfully!*\n\n_Use this command to filter out abusive language from your group._\n\n💡 Powered by *ArslanMD Official*`,
            quoted: message
        });

    } catch (error) {
        console.error('❌ Error in antibadword command:', error);
        await sock.sendMessage(chatId, {
            react: { text: "⚠️", key: message.key }
        });
        await sock.sendMessage(chatId, {
            text: '❌ *Error processing Anti-Badword command.*\nPlease try again later.',
            quoted: message
        });
    }
}

module.exports = antibadwordCommand;
