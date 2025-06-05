const { default: makeWASocket, useMultiFileAuthState, DisconnectReason } = require('@whiskeysockets/baileys');
const pino = require('pino');
const fs = require('fs');
const { Boom } = require('@hapi/boom');

const startBot = async () => {
    const { state, saveCreds } = await useMultiFileAuthState('auth_info_baileys');
    const sock = makeWASocket({
        printQRInTerminal: true,
        auth: state,
        logger: pino({ level: 'silent' }),
        browser: ['Arslan-MD','Safari','1.0.0'],
        defaultQueryTimeoutMs: undefined
    });

    sock.ev.on('creds.update', saveCreds);
    sock.ev.on('connection.update', async (update) => {
        const { connection, lastDisconnect } = update;
        if(connection === 'close') {
            let reason = new Boom(lastDisconnect?.error)?.output.statusCode;
            if(reason === DisconnectReason.badSession) {
                console.log(`Bad Session File, Delete Session and Scan Again`);
                startBot();
            } else if(reason === DisconnectReason.connectionClosed) {
                console.log("Connection closed, reconnecting....");
                startBot();
            } else {
                console.log("Connection closed with reason: ", reason);
            }
        } else if(connection === 'open') {
            console.log('Bot connected.');
        }
    });

    sock.ev.on('messages.upsert', async (m) => {
        const msg = m.messages[0];
        if (!msg.message || msg.key.fromMe) return;

        const text = msg.message.conversation || msg.message.extendedTextMessage?.text;
        const sender = msg.key.remoteJid;

        if (text === '.menu') {
            await sock.sendMessage(sender, { text: '*🤖 Arslan-MD Bot*

`.menu` – Show this menu
More commands coming soon...' });
        }
    });
};

startBot();