const fs = require('fs');
const path = require('path');
const { tmpdir } = require('os');
const { downloadContentFromMessage } = require('@whiskeysockets/baileys');
const { writeFile } = require('fs/promises');

const CONFIG_PATH = path.join(__dirname, '../data/antidelete.json');
const TEMP_DIR = path.join(__dirname, '../tmp');
const messageBank = new Map();

// 🛠 Ensure directories
if (!fs.existsSync(TEMP_DIR)) fs.mkdirSync(TEMP_DIR, { recursive: true });

// 🧠 Config handlers
function loadConfig() {
  try {
    return fs.existsSync(CONFIG_PATH)
      ? JSON.parse(fs.readFileSync(CONFIG_PATH))
      : { enabled: true };
  } catch {
    return { enabled: true };
  }
}

function saveConfig(config) {
  try {
    fs.writeFileSync(CONFIG_PATH, JSON.stringify(config, null, 2));
  } catch (e) {
    console.error('❌ Failed to save antidelete config:', e);
  }
}

// ✅ Command to toggle
async function handleAntideleteCommand(sock, chatId, message, match) {
  if (!message.key.fromMe) return sock.sendMessage(chatId, { text: '❌ *Only bot owner can use this command!*' });
  const config = loadConfig();
  if (!match) {
    return sock.sendMessage(chatId, {
      text: `🛡️ *Antidelete System*

Status: ${config.enabled ? '✅ Enabled' : '❌ Disabled'}

Use:
.antidelete on
.antidelete off`
    });
  }
  config.enabled = match === 'on';
  saveConfig(config);
  await sock.sendMessage(chatId, {
    text: `✅ Antidelete has been *${match === 'on' ? 'enabled' : 'disabled'}* successfully.`
  });
}

// 🧠 Store messages
async function storeMessage(message) {
  const config = loadConfig();
  if (!config.enabled || !message.message) return;

  let mediaType = null;
  let mediaPath = null;
  const key = message.key.id;

  try {
    if (message.message?.imageMessage) {
      mediaType = 'image';
      mediaPath = path.join(TEMP_DIR, `${key}.jpg`);
      const buffer = await downloadContentFromMessage(message.message.imageMessage, 'image');
      await writeFile(mediaPath, buffer);
    } else if (message.message?.videoMessage) {
      mediaType = 'video';
      mediaPath = path.join(TEMP_DIR, `${key}.mp4`);
      const buffer = await downloadContentFromMessage(message.message.videoMessage, 'video');
      await writeFile(mediaPath, buffer);
    } else if (message.message?.stickerMessage) {
      mediaType = 'sticker';
      mediaPath = path.join(TEMP_DIR, `${key}.webp`);
      const buffer = await downloadContentFromMessage(message.message.stickerMessage, 'sticker');
      await writeFile(mediaPath, buffer);
    }

    messageBank.set(key, {
      sender: message.key.participant || message.key.remoteJid,
      group: message.key.remoteJid,
      content: message.message?.conversation || message.message?.extendedTextMessage?.text || '',
      mediaType,
      mediaPath
    });
  } catch (e) {
    console.error('❌ Error storing message:', e);
  }
}

// 🔄 Restore deleted messages
async function handleMessageRevocation(sock, deletedMsg) {
  const config = loadConfig();
  if (!config.enabled) return;

  const key = deletedMsg.message?.protocolMessage?.key?.id;
  if (!key || !messageBank.has(key)) return;

  const info = messageBank.get(key);
  const sender = info.sender.split('@')[0];
  const time = new Date().toLocaleTimeString();

  let caption = `🛡️ *AntiDelete Activated!*

👤 Sender: @${sender}
🕒 Time: ${time}`;
  if (info.content) caption += `
💬 Message: ${info.content}`;

  try {
    await sock.sendMessage(info.group, {
      text: caption,
      mentions: [info.sender]
    });

    if (info.mediaType && fs.existsSync(info.mediaPath)) {
      const sendOptions = {
        caption: `🔁 Restored ${info.mediaType}`,
        mentions: [info.sender]
      };
      const media = fs.readFileSync(info.mediaPath);
      if (info.mediaType === 'image') await sock.sendMessage(info.group, { image: media, ...sendOptions });
      if (info.mediaType === 'video') await sock.sendMessage(info.group, { video: media, ...sendOptions });
      if (info.mediaType === 'sticker') await sock.sendMessage(info.group, { sticker: media });

      fs.unlinkSync(info.mediaPath);
    }
  } catch (e) {
    console.error('❌ Error restoring message:', e);
  } finally {
    messageBank.delete(key);
  }
}

module.exports = {
  handleAntideleteCommand,
  storeMessage,
  handleMessageRevocation
};
