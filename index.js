// ArslanMD Custom Version
const { modul } = require('./module');
const moment = require('moment-timezone');
const express = require("express");
const app = express();
const { baileys, boom, chalk, fs, figlet, FileType, path, pino, process, PhoneNumber } = modul;
const { Boom } = boom
const { default: XeonBotIncConnect, useSingleFileAuthState, fetchLatestBaileysVersion, generateForwardMessageContent, prepareWAMessageMedia, generateWAMessageFromContent, generateMessageID, downloadContentFromMessage, jidDecode, proto } = require("@adiwajshing/baileys")
const {
	default: makeWASocket,
	BufferJSON,
	initInMemoryKeyStore,
	DisconnectReason,
	AnyMessageContent,
        makeInMemoryStore,
	useMultiFileAuthState,
	delay
} = require("@adiwajshing/baileys")
const { color, bgcolor } = require('./lib/color')
const colors = require('colors')
const { uncache, nocache } = require('./lib/loader')
const { start } = require('./lib/spinner')
const { imageToWebp, videoToWebp, writeExifImg, writeExifVid } = require('./lib/exif')
const { smsg, isUrl, generateMessageTag, getBuffer, getSizeMedia, fetchJson, await, sleep, reSize } = require('./lib/myfunc')

const owner = JSON.parse(fs.readFileSync('./database/owner.json'))

const store = makeInMemoryStore({ logger: pino().child({ level: 'silent', stream: 'store' }) })

const me = 

require('./XeonCheems7.js')
nocache('../XeonCheems7.js', module => console.log(color('[ CHANGE ]', 'green'), color(`'${module}'`, 'green'), 'Updated'))
require('./index.js')
nocache('../index.js', module => console.log(color('[ CHANGE ]', 'green'), color(`'${module}'`, 'green'), 'Updated'))

function title() {
      console.clear()
      console.log(chalk.yellow(`\n\n               ${chalk.bold.yellow(`[ ${botname} ]`)}\n\n`))
      console.log(color(`< ================================================== >`, 'cyan'))
	console.log(color(`\n${themeemoji} YT CHANNEL: Arslan-MD Club`,'magenta'))
	console.log(color(`${themeemoji} GITHUB: ArslanMDofficial`,'magenta'))
	console.log(color(`${themeemoji} WA NUMBER: ${owner}`,'magenta'))
	console.log(color(`${themeemoji} CREDIT: ArslanMD\n`,'magenta'))
}

// HTML page customization
app.get("/", (req, res) => res.type('html').send(`
<!DOCTYPE html>
<html>
<head>
<title>Arslan-MD</title>
<script src="https://cdn.jsdelivr.net/npm/canvas-confetti@1.5.1/dist/confetti.browser.min.js"></script>
<script>
setTimeout(() => {
confetti({
  particleCount: 100,
  spread: 70,
  origin: { y: 0.6 },
  disableForReducedMotion: true
});
}, 500);
</script>
<style>
@import url("https://p.typekit.net/p.css?s=1&k=vnd5zic&ht=tk&f=39475.39476.39477.39478.39479.39480.39481.39482&a=18673890&app=typekit&e=css");
@font-face {
font-family: "neo-sans";
src: url("https://use.typekit.net/af/00ac0a/00000000000000003b9b2033/27/l?primer=7cdcb44be4a7db8877ffa5c0007b8dd865b3bbc383831fe2ea177f62257a9191&fvd=n7&v=3") format("woff2"), url("https://use.typekit.net/af/00ac0a/00000000000000003b9b2033/27/d?primer=7cdcb44be4a7db8877ffa5c0007b8dd865b3bbc383831fe2ea177f62257a9191&fvd=n7&v=3") format("woff"), url("https://use.typekit.net/af/00ac0a/00000000000000003b9b2033/27/a?primer=7cdcb44be4a7db8877ffa5c0007b8dd865b3bbc383831fe2ea177f62257a9191&fvd=n7&v=3") format("opentype");
font-style: normal;
font-weight: 700;
}
html {
font-family: neo-sans;
font-weight: 700;
font-size: calc(62rem / 16);
}
body {
background: white;
   }
section {
border-radius: 1em;
padding: 1em;
position: absolute;
top: 50%;
left: 50%;
margin-right: -50%;
transform: translate(-50%, -50%);
   }
</style>
  </head>
    <body>
      <section>
        Thanks For Using Arslan-MD Bot!<br>
        Developed with ❤️ by ArslanMDofficial
      </section>
   </body>
</html>
`));
