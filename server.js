const express = require('express');
const path = require('path');
const { spawn } = require('child_process');

const app = express();
const PORT = process.env.PORT || 3000;

// ✅ Start the WhatsApp bot (index.js)
console.log('🚀 Starting Arslan-MD bot...');
const botProcess = spawn('node', ['index.js'], {
  stdio: 'inherit',
  shell: true
});

botProcess.on('error', (err) => {
  console.error('❌ Failed to start bot:', err.message);
});

botProcess.on('exit', (code, signal) => {
  console.warn(`⚠️ Bot process exited with code ${code} and signal ${signal}`);
});

// ✅ Serve static files from "public" directory
const publicDir = path.join(__dirname, 'public');
if (require('fs').existsSync(publicDir)) {
  app.use(express.static(publicDir));
  app.get('/', (req, res) => {
    res.sendFile(path.join(publicDir, 'index.html'));
  });
} else {
  app.get('/', (req, res) => {
    res.send(`<h2>🤖 Arslan-MD Bot is Running!</h2><p>Static folder not found.</p>`);
  });
}

// ✅ Health check route for Koyeb/Render
app.get('/health', (req, res) => {
  res.status(200).send('✅ OK');
});

// ✅ Start web server
app.listen(PORT, () => {
  console.log(`✅ Web server is live: http://localhost:${PORT}`);
});
