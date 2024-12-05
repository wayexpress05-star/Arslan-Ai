const {cmd , commands} = require('../command')

cmd({
    pattern: "menu",
    desc: "menu the bot",
    category: "menu",
    react: "💋",
    filename: __filename
},

async(conn, mek, m,{from, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply}) => {
try{

let dec = `
 ╭─────────────━┈⊷
│*🧚‍♀️ ʙᴏᴛ ɴᴀᴍᴇ*: Arslan-MD
│*👨‍💻 ᴏᴡɴᴇʀ*: ArslanMD Tech    
│*👤 ɴᴜᴍʙᴇʀ*: 923237045919
│
│*🧬Version*: 8.0.0
│*💻 HOST* :  arslanmd.com
│*💫 ᴘʀᴇғɪx:* .
╰─────────────━┈⊷ 
*꧁*◈╾───OWNER COMMAND ───╼◈*꧂*
╭────────●●►
┋ ➽ *restart* 
┋ ➽ *block*
┋ ➽ *setting*
┋ ➽ *unblock*
┋ ➽ *jid*
╰━━━━∙⋆⋅⋆∙━ ─┉─ • ─┉─⊷

*꧁*◈╾───CONVERT COMMAND ───╼◈*꧂*
╭────────●●►
┋ ➽ *convert* 
┋ ➽ *ss* 
╰━━━━∙⋆⋅⋆∙━ ─┉─ • ─┉─⊷

*꧁*◈╾───AI COMMAND ───╼◈*꧂*
╭────────●●►
┋ ➽ *ai* 
╰━━━━∙⋆⋅⋆∙━ ─┉─ • ─┉─⊷

*꧁*◈╾───SEARCH COMMAND ───╼◈*꧂*
╭────────●●►
┋ ➽ *yt* 
┋ ➽ *song* 
┋ ➽ *video* 
┋ ➽ *movie* 
╰━━━━∙⋆⋅⋆∙━ ─┉─ • ─┉─⊷

*꧁*◈╾─DOWNLOAD COMMAND ──╼◈*꧂*
╭────────●●►
┋ ➽ *apk* 
┋ ➽ *twitter* 
┋ ➽ *gdrive* 
┋ ➽ *mediafire* 
┋ ➽ *fb*
┋ ➽ *ig* 
┋ ➽ *movie*
┋ ➽ *song* 
┋ ➽ *video* 
┋ ➽ *play/yt* 
┋ ➽ *yt*
┋ ➽ *tiktok* 
┋ ➽ *img* 
╰━━━━∙⋆⋅⋆∙━ ─┉─ • ─┉─⊷

*꧁*◈╾───MAIN COMMAND ───╼◈*꧂*
╭────────●●►
┋ ➽ *alive* 
┋ ➽ *about* 
┋ ➽ *menu* 
┋ ➽ *allmenu* 
┋ ➽ *support* 
┋ ➽ *system* 
┋ ➽ *ping* 
┋ ➽ *runtime* 
╰━━━━∙⋆⋅⋆∙━ ─┉─ • ─┉─⊷

*꧁*◈╾───GROUP COMMAND ───╼◈*꧂*
╭────────●●►
┋ ➽ *promote* 
┋ ➽ *demote* 
┋ ➽ *kick* 
┋ ➽ *add* 
┋ ➽ *admins* 
┋ ➽ *tagall* 
┋ ➽ *getpic* 
┋ ➽ *setwelcome* 
┋ ➽ *setgoodbye* 
┋ ➽ *admins*
┋ ➽ *gname* 
┋ ➽ *tagall* 
┋ ➽ *tagadmin* 
┋ ➽ *opentime/closetime* 
┋ ➽ *groupinfo* 
┋ ➽ *grouplink* 
╰━━━━∙⋆⋅⋆∙━ ─┉─ • ─┉─⊷

*꧁*◈╾───FUN COMMAND ───╼◈*꧂*
╭────────●●►
┋ ➽ *dog* 
┋ ➽ *fact* 
┋ ➽ *hack* 
┋ ➽ *quote* 
┋ ➽ *loli* 
╰━━━━∙⋆⋅⋆∙━ ─┉─ • ─┉─⊷

*꧁*◈╾───OTHER COMMAND ───╼◈*꧂*
╭────────●●►
┋ ➽ *trt* 
┋ ➽ *weather* 
╰━━━━∙⋆⋅⋆∙━ ─┉─ • ─┉─⊷

* ▣▣▣▣▣▣▣▣▣▣▣▣*⁠⁠⁠⁠

*ׂ╰┈➤Reply with the Number you want to select*

*⭕Arslan MD NEW UPDATE*

*🖇️https://whatsapp.com/channel/0029VarfjW04tRrmwfb8x306*

> *©ᴘᴏᴡᴇʀᴇᴅ ʙʏ ArslanMDッ*
`
await conn.sendMessage(from,{image:{url: `https://files.catbox.moe/zw6rsz.jpg`},caption:dec},{quoted:mek});

}catch(e){
console.log(e)
reply(`${e}`)
}
})
