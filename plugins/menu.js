module.exports = {
  name: 'menu',
  alias: ['help'],
  category: 'general',
  desc: 'Shows bot menu',
  async run({ m, sock, args }) {
    let menu = `
╭─❍  *Arslan-MD Menu*
│ • .ai <prompt>
│ • .yt <url>
│ • .welcome on/off
│ • .ban <@user>
╰─────────────`;
    await sock.sendMessage(m.chat, { text: menu }, { quoted: m });
  }
};
