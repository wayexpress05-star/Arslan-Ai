const express = require('express');
const path = require('path');
const { spawn } = require('child_process');

const app = express();
const PORT = process.env.PORT || 3000;

// ✅ Start WhatsApp bot (index.js)
const botProcess = spawn('node', ['index.js'], {
  stdio: 'inherit', // shows logs in Render/Koyeb logs
});

// ✅ Serve static files from "public" folder (like index.html, CSS, images)
app.use(express.static(path.join(__dirname, 'public')));

// ✅ Route: homepage = luxury landing page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/index.html'));
});

// ✅ Start web server for Render
app.listen(PORT, () => {
  console.log(`✅ Web server running on http://localhost:${PORT}`);
});
