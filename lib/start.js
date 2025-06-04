// Starter logic for bot
const { default: makeWASocket, DisconnectReason, useSingleFileAuthState } = require('@whiskeysockets/baileys');
const P = require('pino');
const fs = require('fs');
const path = require('path');

// Load session ID from config
const { sessionID } = require('../config');

// Auth file path
const authFilePath = './session.json';

// Write sessionID to auth file if not present
if (!fs.existsSync(authFilePath)) {
    if (!sessionID) {
        console.error('❌ Session ID not found in config.js');
        process.exit(1);
    }

    const decoded = Buffer.from(sessionID.replace('Sarkarmd$', ''), 'base64').toString();
    fs.writeFileSync(authFilePath, decoded);
    console.log('✅ Session restored from sessionID');
}

// Load auth state
const { state, saveState } = useSingleFileAuthState(authFilePath);

// Load plugins
const loadPlugins = (sock) => {
    const pluginDir = path.join(__dirname, '..', 'plugins');
    fs.readdirSync(pluginDir).forEach(file => {
        if (file.endsWith('.js')) {
            try {
                require(path.join(pluginDir, file))(sock);
                console.log(`✅ Plugin loaded: ${file}`);
            } catch (e) {
                console.error(`❌ Error in plugin ${file}`, e);
            }
        }
    });
};

// Start bot
async function startBot() {
    const sock = makeWASocket({
        logger: P({ level: 'silent' }),
        printQRInTerminal: false,
        auth: state,
        browser: ['Arslan-MD', 'Safari', '1.0.0'],
    });

    // Save session automatically
    sock.ev.on('creds.update', saveState);

    // Handle messages
    sock.ev.on('messages.upsert', async ({ messages, type }) => {
        if (type !== 'notify') return;
        const msg = messages[0];
        if (!msg.message || msg.key.fromMe) return;

        const body = msg.message.conversation || msg.message.extendedTextMessage?.text || '';

        if (body.startsWith('.ping')) {
            await sock.sendMessage(msg.key.remoteJid, { text: '```Pong!```' }, { quoted: msg });
        }

        // Add more built-in commands here if needed
    });

    // Load external plugins
    loadPlugins(sock);

    // Connection closed handling
    sock.ev.on('connection.update', (update) => {
        const { connection, lastDisconnect } = update;
        if (connection === 'close') {
            const shouldReconnect = lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut;
            console.log('⚠️ Connection closed. Reconnecting:', shouldReconnect);
            if (shouldReconnect) {
                startBot();
            } else {
                console.log('❌ Logged out. Delete session.json and restart.');
            }
        } else if (connection === 'open') {
            console.log('✅ Bot is connected!');
        }
    });
}

// Start
startBot();
