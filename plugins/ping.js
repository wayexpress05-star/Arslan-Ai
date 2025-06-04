const { performance } = require('perf_hooks');

module.exports = {
  name: 'ping',
  alias: ['speed'],
  description: 'Check bot response speed',
  category: 'general',
  usage: '.ping',
  async execute(client, m, args) {
    const start = performance.now();
    await m.reply('Pinging...');
    const end = performance.now();
    const speed = (end - start).toFixed(2);
    m.reply(`🏓 Pong! Response in ${speed} ms`);
  }
};
