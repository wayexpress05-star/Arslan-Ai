const fs = require('fs-extra');
const { Sequelize } = require('sequelize');
if (fs.existsSync('set.env'))
    require('dotenv').config({ path: __dirname + '/set.env' });
const path = require("path");
const databasePath = path.join(__dirname, './database.db');
const DATABASE_URL = process.env.DATABASE_URL === undefined
    ? databasePath
    : process.env.DATABASE_URL;
module.exports = { session: process.env.SESSION_ID || 'Zokou-MD-WHATSAPP-BOT;;;=>eyJub2lzZUtleSI6eyJwcml2YXRlIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoidUpSd09TMC9mOVE4ZmtLN3FiVjZmUk1IdEtCT213Z0pZOURWZk1qYm9Fbz0ifSwicHVibGljIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiM3lUcWREVkRzR0dVQ2JDc1g3cmxoSFZVblVoaTZ5U3dJL1NpMVh5Y1NGRT0ifX0sInBhaXJpbmdFcGhlbWVyYWxLZXlQYWlyIjp7InByaXZhdGUiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiJRSGswb1hiZmh5VGVjREk2TlBYNE5vNTM1VVlEaS9XN3JTd21xR1E1R0c4PSJ9LCJwdWJsaWMiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiJuUE45UWRSclk0ZWp6VkxvWCtjZTNTYnV5SmtJQTdQRUkyWGJkZlZLaUZRPSJ9fSwic2lnbmVkSWRlbnRpdHlLZXkiOnsicHJpdmF0ZSI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6Ik1LNk9DSE80bmppZEw1eHdaaWF0MXU0L2luTTdnVS9ZcXJxMWlGWEZzWFU9In0sInB1YmxpYyI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6IlVSZDcxU0xTdTBMYStFYlhaK1FaZFhlVDkrSWVFVEgxTHg3L3ZiS3lqMGs9In19LCJzaWduZWRQcmVLZXkiOnsia2V5UGFpciI6eyJwcml2YXRlIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiK0NJNmg0VTRmZ3FLZHR4ZGFFMkwySTRXaXVSRmE5OWVhcWxpNXFqSngxaz0ifSwicHVibGljIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoieTJHYm1aQUFCOGtTMjBZMEh0cHBsQU50dkMvQlRwNENzaGI5SjVwNEdXTT0ifX0sInNpZ25hdHVyZSI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6IktLWlQ2NGpaSTRaTldkTkRNU0F0a2YvZVBteFROMzFnR3ZYNlNhMkxMbG5pdmx1VVR0M3V6Sjg0QlhYY2dpamtQclhUSVRUeTRnOFgrYm1Gd3lhUmp3PT0ifSwia2V5SWQiOjF9LCJyZWdpc3RyYXRpb25JZCI6NDEsImFkdlNlY3JldEtleSI6IlBld1JyeEllc2pVSk92NUp1a0Z2V29qU1R1bmFWM3ZkV3NLSVdaaFo1L2c9IiwicHJvY2Vzc2VkSGlzdG9yeU1lc3NhZ2VzIjpbXSwibmV4dFByZUtleUlkIjozMSwiZmlyc3RVbnVwbG9hZGVkUHJlS2V5SWQiOjMxLCJhY2NvdW50U3luY0NvdW50ZXIiOjAsImFjY291bnRTZXR0aW5ncyI6eyJ1bmFyY2hpdmVDaGF0cyI6ZmFsc2V9LCJyZWdpc3RlcmVkIjpmYWxzZSwiYWNjb3VudCI6eyJkZXRhaWxzIjoiQ0xLUnFLd0dFT2l0bHNJR0dBWWdBQ2dBIiwiYWNjb3VudFNpZ25hdHVyZUtleSI6IlRvU1VxR09jZUVHZVJpREE5TzhHMFRWVjZ2UW9CVUVmdlo2V1l6ZEQrd1U9IiwiYWNjb3VudFNpZ25hdHVyZSI6IjU4Qktwbkh6YkZyY3gwMXBVZEs5L1JxbmZERVk3d2xmK0puT1NWcTdMQXlqVWRYanR1RFVITEZiV3dKWHl3Qkd0bGVsazNrcmoyUGxmZ1JGVVpkYkNBPT0iLCJkZXZpY2VTaWduYXR1cmUiOiIrV0VmU2dNM3ZFRE1yL3hCMkl0VTZQTHNoaVhna3FHSDVpK2hqTjROSTNRSGF4QzBhZEEwQVBybDhyVG5EdDRqbjJoUTN3NHBhN1NlTmVBbVZrUGFpUT09In0sIm1lIjp7ImlkIjoiOTIzMjM3MDQ1OTE5OjI5QHMud2hhdHNhcHAubmV0IiwibmFtZSI6IlBhayBBcm15IiwibGlkIjoiMTMxMDY1NzQyMTI3MjM0OjI5QGxpZCJ9LCJzaWduYWxJZGVudGl0aWVzIjpbeyJpZGVudGlmaWVyIjp7Im5hbWUiOiI5MjMyMzcwNDU5MTk6MjlAcy53aGF0c2FwcC5uZXQiLCJkZXZpY2VJZCI6MH0sImlkZW50aWZpZXJLZXkiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiJCVTZFbEtoam5IaEJua1lnd1BUdkJ0RTFWZXIwS0FWQkg3MmVsbU0zUS9zRiJ9fV0sInBsYXRmb3JtIjoic21iYSIsInJvdXRpbmdJbmZvIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiQ0JJSUFnPT0ifSwibGFzdEFjY291bnRTeW5jVGltZXN0YW1wIjoxNzQ5MzkxMDg2LCJsYXN0UHJvcEhhc2giOiIxSzRoSDQiLCJteUFwcFN0YXRlS2V5SWQiOiJBQUFBQUlSYiJ9',
     ETAT:process.env.ETAT,
    PREFIXE: process.env.PREFIXE,
    NOM_OWNER: process.env.NOM_OWNER || "Zokou-Md",
    NUMERO_OWNER : process.env.NUMERO_OWNER,              
    LECTURE_AUTO_STATUS: process.env.LECTURE_AUTO_STATUS || "non",
    TELECHARGER_AUTO_STATUS: process.env.TELECHARGER_AUTO_STATUS || 'non',
    MODE: process.env.MODE_PUBLIC,
    PM_PERMIT: process.env.PM_PERMIT || 'non',
    BOT : process.env.NOM_BOT || 'Zokou_MD',
    URL : process.env.LIENS_MENU || 'https://static.animecorner.me/2023/08/op2.jpg',
    HEROKU_APP_NAME : process.env.HEROKU_APP_NAME,
    HEROKU_APY_KEY : process.env.HEROKU_APY_KEY ,
    WARN_COUNT : process.env.WARN_COUNT || '3' ,
    //GPT : process.env.OPENAI_API_KEY,
    DP : process.env.STARTING_BOT_MESSAGE || 'oui',
    ATD : process.env.ANTI_DELETE_MESSAGE || 'non',            
    DATABASE_URL,
    DATABASE: DATABASE_URL === databasePath
        ? "postgres://db_7xp9_user:6hwmTN7rGPNsjlBEHyX49CXwrG7cDeYi@dpg-cj7ldu5jeehc73b2p7g0-a.oregon-postgres.render.com/db_7xp9" : "postgres://db_7xp9_user:6hwmTN7rGPNsjlBEHyX49CXwrG7cDeYi@dpg-cj7ldu5jeehc73b2p7g0-a.oregon-postgres.render.com/db_7xp9",
    /* new Sequelize({
     dialect: 'sqlite',
     storage: DATABASE_URL,
     logging: false,
})
: new Sequelize(DATABASE_URL, {
     dialect: 'postgres',
     ssl: true,
     protocol: 'postgres',
     dialectOptions: {
         native: true,
         ssl: { require: true, rejectUnauthorized: false },
     },
     logging: false,
}),*/
};
let fichier = require.resolve(__filename);
fs.watchFile(fichier, () => {
    fs.unwatchFile(fichier);
    console.log(`mise à jour ${__filename}`);
    delete require.cache[fichier];
    require(fichier);
});
