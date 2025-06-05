const express = require('express');
const app = express();
const PORT = process.env.PORT || 8000;

app.get('/', (req, res) => {
  res.send('Arslan-MD bot is running.');
});

app.listen(PORT, () => {
  console.log(`✅ Web server running on port ${PORT}`);
});
