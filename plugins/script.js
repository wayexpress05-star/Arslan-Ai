const config = require('../config')
const {cmd , commands} = require('../command')
cmd({
    pattern: "script",
    alias: ["sc","repo","info"],
    desc: "bot repo",
    react: "🤖",
    category: "main",
    filename: __filename
},
async(conn, mek, m,{from, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply}) => {
try{
let repo =`
*╭──────────────●●►*
> *BOT OWNER:*
*|* *ArslanMD Official*

> *SANA_MD REPO:*
*|* *https://github.com/Arslan-MD/Arslan-MD*

> *SUPPORT CHENNAL:*
*|* *https://whatsapp.com/channel/0029VarfjW04tRrmwfb8x306*
*╰──────────────●●►*

> *CREATED BY ArslanMD*
`
await conn.sendMessage(from, { text: repo ,
  contextInfo: {
    mentionedJid: [ '' ],
    groupMentions: [],
    forwardingScore: 999,
    isForwarded: false,
    forwardedNewsletterMessageInfo: {
      newsletterJid: '120363232588171807@newsletter',
      newsletterName: "ArslanMD",
      serverMessageId: 999
    },
externalAdReply: { 
title: 'Arslan-MD',
body: `${pushname}`,
mediaType: 1,
sourceUrl: "https://github.com/Arslan-MD/Arslan-MD" ,
thumbnailUrl: "https://files.catbox.moe/zw6rsz.jpg" ,
renderLargerThumbnail: true,
showAdAttribution: true
}
}}, { quoted: mek})}catch(e){
console.log(e)
reply(`${e}`)
}
});
