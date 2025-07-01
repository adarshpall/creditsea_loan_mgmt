const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const cors = require('cors');

const loanRoutes = require('./routes/loanRoutes');
const { handleLoanMessage } = require('./controllers/loanControllers');
const {
  metrics,
  broadcastMetrics,
} = require('./utils/metrics');

dotenv.config();

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });
global.wss = wss; // 

const stopBroadcast = broadcastMetrics(wss);
let paused = false;

wss.on('connection', (ws) => {
  console.log('📡 WebSocket client connected');
  ws.on('message', async (message) => {
    try {
      const data = JSON.parse(message);
      if (data.type === 'loanData' && !paused) {
        await handleLoanMessage(data.payload, ws);
      }
    } catch (err) {
      console.error(' WebSocket error:', err.message);
    }
  });

  ws.send(JSON.stringify({ type: 'connected', payload: 'Welcome to WebSocket server!' }));
});

app.use(cors());
app.use(express.json());
app.use('/api/loans', loanRoutes);

app.post('/api/control/pause', (req, res) => {
  paused = true;
  res.json({ status: 'paused' });
});
app.get('/api/status', (req, res) => {
  res.json({
    incomingRate: Math.floor(Math.random() * 500),  // Replace with real metric
    processedRate: Math.floor(Math.random() * 480),
    errorRate: Math.floor(Math.random() * 20),
    retryQueue: Math.floor(Math.random() * 50),
    memory: Math.floor(process.memoryUsage().heapUsed / 1024 / 1024),
    socketConnected: true // Replace with actual socket status if available
  });
});

app.post('/api/control/resume', (req, res) => {
  paused = false;
  res.json({ status: 'resumed' });
});

const PORT = process.env.PORT || 8000;

mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log(' MongoDB connected');
  server.listen(PORT, () => {
    console.log(` Server running on http://localhost:${PORT}`);
  });
}).catch(err => {
  console.error(' MongoDB connection failed:', err.message);
  process.exit(1);
});
