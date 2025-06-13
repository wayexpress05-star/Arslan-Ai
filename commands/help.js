console.log('⚡ .help command activated!');
console.log('📥 .help command triggered');
const settings = require('../settings');
const fs = require('fs');
const path = require('path');

async function helpCommand(sock, chatId, message) {
    const helpMessage = `
╔═━「 🤖 *Arslan-MD Help Menu* 」━═╗

📌 *Prefix:* Use \`.\` before each command  
📸 Image auto-included from assets/bot_banner.jpg

━━━━━━━━━━
📥 *Download Menu*  
.facebook (Facebook video download kare)  
.mediafire (Download any file from Mediafire link)  
.tiktok (Download TikTok videos without watermark)  
.twitter (Download Twitter video/audio)  
.insta (Download Instagram post, reel, or story)  
.apk (Search & get Android APK files)  
.img (Search random image by keyword)  
.tt2 (Alternative TikTok downloader)  
.pins (Fetch Pinterest pins by keyword)  
.fb2 (Alternative Facebook downloader)  
.pinterest (Download Pinterest images)  
.spotify (Get Spotify song link info)  
.play (Play and download YouTube audio)  
.song (Search & get songs)  
.audio (Download audio from video or link)  
.video (Download YouTube or short videos)  
.ytmp3 (YouTube MP3 converter)  
.ytmp4 (YouTube MP4 video converter)  
.song (Duplicate: song download again)  
.darama (Download drama episodes)  
.gdrive (Google Drive file downloader)  
.ssweb (Website screenshot tool)  
.tiks (Extra TikTok downloader)

━━━━━━━━━━
👥 *Group Menu*  
.grouplink (Get current group invite link)  
.kickall (Remove all group members)  
.kickall2 (Alternate group wipeout)  
.kickall3 (Forcefully kick all members)  
.add (Add user to group via number)  
.remove (Remove tagged user from group)  
.kick (Kick mentioned user)  
.promote (Make user admin)  
.demote (Remove admin rights)  
.dismiss (Dismiss all admins)  
.revoke (Revoke current invite link)  
.setgoodbye (Set goodbye message)  
.setwelcome (Set welcome message)  
.delete (Delete bot/reply message)  
.getpic (Get profile pic of user)  
.ginfo (Show full group info)  
.disappear on (Enable disappearing msgs)  
.disappear off (Disable disappearing msgs)  
.disappear (Toggle disappearing mode)  
.allreq (Show all group join requests)  
.updategname (Update group name)  
.updategdesc (Update group description)  
.joinrequests (View join requests)  
.senddm (Send DM to user)  
.nikal (Kick a member using .nikal)  
.mute (Mute group chat)  
.unmute (Unmute group chat)  
.lockgc (Lock group chat)  
.unlockgc (Unlock group chat)  
.invite (Generate group invite code)  
.tag (Tag all members normally)  
.hidetag (Tag without showing usernames)  
.tagall (Mention everyone)  
.tagadmins (Mention only admins)

━━━━━━━━━━
🎭 *Reaction Menu*  
.bully @tag (Bully animation on user)  
.cuddle @tag (Cuddle the user)  
.cry @tag (Send crying gif)  
.hug @tag (Hug the tagged user)  
.awoo @tag (Awoo sound reaction)  
.kiss @tag (Kiss gif)  
.lick @tag (Lick animation)  
.pat @tag (Pat someone gently)  
.smug @tag (Smug reaction)  
.bonk @tag (Bonk user with hammer)  
.yeet @tag (Yeet user away)  
.blush @tag (Blush at user)  
.smile @tag (Smile at user)  
.wave @tag (Wave hand to user)  
.highfive @tag (Give a highfive)  
.handhold @tag (Hold hands)  
.nom @tag (Eat user jokingly)  
.bite @tag (Bite the tagged user)  
.glomp @tag (Glomp/hug tackle)  
.slap @tag (Slap with meme gif)  
.kill @tag (Kill gif - anime style)  
.happy @tag (Show happiness)  
.wink @tag (Wink at user)  
.poke @tag (Poke the user)  
.dance @tag (Send dance gif)  
.cringe @tag (Cringe expression)
━━━━━━━━━━
🎨 *Logo Maker Menu*  
.neonlight (Neon light styled text logo)  
.blackpink (Blackpink logo style)  
.dragonball (DragonBall anime logo style)  
.3dcomic (3D comic text logo)  
.america (USA flag themed logo)  
.naruto (Naruto-style name logo)  
.sadgirl (Sad girl themed logo)  
.clouds (Cloud effect logo)  
.futuristic (Futuristic tech-style logo)  
.3dpaper (3D paper style text)  
.eraser (Eraser style text logo)  
.sunset (Sunset background logo)  
.leaf (Leaf theme text logo)  
.galaxy (Galaxy space styled logo)  
.sans (Undertale Sans text logo)  
.boom (Explosion effect logo)  
.hacker (Green hacker terminal style)  
.devilwings (Dark devil wing logo)  
.nigeria (Nigeria styled logo)  
.bulb (Bulb effect logo)  
.angelwings (Angel wings text)  
.zodiac (Zodiac symbol logo)  
.luxury (Luxury golden style logo)  
.paint (Paint splash logo)  
.frozen (Frozen text effect)  
.castle (Castle theme)  
.tatoo (Tattoo style name)  
.valorant (Valorant text logo)  
.bear (Cute bear themed logo)  
.typography (Clean typography design)  
.birthday (Birthday themed text)

━━━━━━━━━━
👑 *Owner Menu*  
.owner (Show owner's contact info)  
.menu (Show main menu of the bot)  
.menu2 (Show secondary/extra menu)  
.vv (Developer info or status command)  
.listcmd (List all available commands)  
.allmenu (Show everything combined)  
.repo (GitHub repo of Arslan-MD)  
.block (Block user from using bot)  
.unblock (Unblock previously blocked user)  
.fullpp (Set full profile picture of bot)  
.setpp (Set bot profile picture)  
.restart (Restart the bot)  
.shutdown (Shut down the bot manually)  
.updatecmd (Update command system)  
.alive (Show bot’s active status)  
.ping (Ping speed & system response time)  
.gjid (Group JID information)  
.jid (Your personal WhatsApp JID)  
.bible (Fetch random Bible verse)  
.biblelist / .blist (Show Bible chapter list)

━━━━━━━━━━
🎉 *Fun Menu*  
.shapar (Funny Pakistani insult-style)  
.rate (Rate something out of 100%)  
.insult (Send a random insult)  
.hack (Fake hacking screen)  
.ship (Matchmaking / ship between users)  
.character (Anime character guess)  
.pickup (Pickup line generator)  
.joke (Random funny joke)  
.hrt (Heart emoji art)  
.hpy (Happy response)  
.syd (Sad response)  
.anger (Angry response)  
.shy (Shy anime style message)  
.kiss (Kiss emoji effect)  
.mon (Monkey-style meme reaction)  
.cunfuzed (Confused reply with emoji)  
.setpp (Set bot profile photo again)  
.hand (Hand emoji gesture)  
.nikal (Send user away with meme)  
.hold (Hold emoji interaction)  
.hug (Hug gif/emotion)  
.nikal (Same: joke kick)  
.hifi (Hi-Fi hand emoji)  
.poke (Poke fun reaction)

━━━━━━━━━━
🔄 *Convert Menu*  
.sticker (Convert image to sticker)  
.sticker2 (Alternate sticker maker)  
.emojimix (Mix 2 emojis as 1 sticker)  
.fancy (Stylish text formatter)  
.take (Set sticker info and rename)  
.tomp3 (Convert video to MP3)  
.tts (Text to speech converter)  
.trt (Translate to selected language)  
.base64 (Encode to base64)  
.unbase64 (Decode base64 text)  
.binary (Convert text to binary)  
.dbinary (Convert binary to text)  
.tinyurl (Shorten a link)  
.urldecode (Decode a URL string)  
.urlencode (Encode a URL string)  
.url (Same: check or create URL)  
.repeat (Repeat text multiple times)  
.ask (Ask AI or trivia bot)  
.readmore (Add readmore divider)  
.help (Show help commands)  
.support (Get support info)

━━━━━━━━━━
🤖 *AI Menu*  
.ai (Ask general question to AI)  
.gpt3 (Use ChatGPT-3 for responses)  
.gpt2 (Old GPT model response)  
.gptmini (Lightweight fast GPT version)  
.gpt (Default ChatGPT integration)  
.meta (Meta AI integration)  
.blackbox (Blackbox AI coder)  
.luma (Luma music AI)  
.dj (DJ remix suggestion AI)  
.gpt4 (Advanced GPT-4 AI)  
.bing (Bing AI assistant)  
.imagine (AI image generator 1)  
.imagine2 (AI image generator 2)  
.copilot (Programming assistant by AI)

━━━━━━━━━━
⚡ *Main Menu*  
.ping (Check bot speed)  
.speed (Alternate speed command)  
.live (Show live status)  
.alive (Confirm bot is active)  
.runtime (Show running time)  
.uptime (How long bot has been online)  
.repo (Bot repository link)  
.owner (Contact owner)  
.menu (Open main menu)  
.menu2 (Show full/extra menu)  
.restart (Restart the bot)

━━━━━━━━━━
🎎 *Anime Menu*  
.fack (Fake anime dialogue)  
.truth (Truth question for fun)  
.dare (Dare challenge)  
.dog (Anime dog image)  
.awoo (Anime awoo gif)  
.garl (Random anime girl image)  
.waifu (Random waifu picture)  
.neko (Anime neko image)  
.megnumin (Megnumin gif)  
.neko (Repeated neko gif)  
.maid (Anime maid image)  
.loli (Anime loli style)  
.animenews (Get anime news updates)  
.foxgirl (Anime fox girl image)  
.naruto (Naruto image/gif)

━━━━━━━━━━
ℹ️ *Other Menu*  
.timenow (Show current time)  
.date (Display today's date)  
.count (Count chars/words in text)  
.calculate (Simple calculator)  
.countx (Advanced counter tool)  
.flip (Flip coin)  
.coinflip (Flip coin game)  
.rcolor (Get random color name/code)  
.roll (Roll a number dice)  
.fact (Random world fact)  
.cpp (Send funny C++ code)  
.rw (Random word)  
.pair (Random couple matcher)  
.pair2 (Alternate ship result)  
.fancy (Stylish text again)  
.logo <text> (Generate logo with text)  
.define (Dictionary define word)  
.news (Daily news headlines)  
.movie (Movie info fetcher)  
.weather (Weather by city)  
.srepo (Script repo)  
.insult (Another insult option)  
.save (Save message or media)  
.wikipedia (Search Wikipedia)  
.gpass (Generate random password)  
.githubstalk (Stalk GitHub user)  
.yts (YouTube video search)  
.ytv (YouTube video fetcher)

━━━━━━━━━━
🔮 *Coming Features*  
.quran (Quran ayat fetcher)  
.hadith (Hadith database search)  
.namaz (Prayer time by location)  
.games v2 (New games integration)  
.whatsappBotBuilder (GUI tool builder)  
.premium image gen (High-quality AI images)  
.group analytics (Group stats & charts)  
.watermark remover (Remove image/video logo)

━━━━━━━━━━
🤖 *Thank you for using Arslan-MD!*  
Made with ❤️ by ArslanMD Official
`.trim();
    const imagePath = path.join(__dirname, '../assets/bot_banner.jpg');

    try {
        if (fs.existsSync(imagePath)) {
            await sock.sendMessage(chatId, {
                image: fs.readFileSync(imagePath),
                caption: helpMessage
            }, { quoted: message });
        } else {
            await sock.sendMessage(chatId, {
                text: helpMessage
            }, { quoted: message });
        }
    } catch (err) {
        console.error('❌ Error sending help menu:', err);
        await sock.sendMessage(chatId, {
            text: helpMessage
        }, { quoted: message });
    }
}

module.exports = helpCommand;
