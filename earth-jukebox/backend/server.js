// backend/server.js
import express from 'express';
import cors from 'cors';

const app = express();
app.use(cors());

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', mode: 'offline-first-hackathon' });
});

app.listen(5000, () => {
  console.log('Earth Jukebox API running on http://localhost:5000');
});
