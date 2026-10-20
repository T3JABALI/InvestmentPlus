require('dotenv').config();

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const authRoutes = require('./src/routes/auth');

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(helmet());

const cors = require('cors');

app.use(cors({
  origin: 'https://investmentplus.vercel.app',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

app.use(express.json({ limit: '20kb' }));

app.get('/health', (_req, res) => {
  res.json({
    ok: true,
    service: 'InvestmentPlus API',
    timestamp: new Date().toISOString(),
  });
});

app.use('/api/auth', authRoutes);

app.use((err, _req, res, _next) => {
  console.error('Request error:', err.message);
  res.status(500).json({ error: 'An unexpected server error occurred.' });
});

app.listen(PORT, () => {
  console.log(`InvestmentPlus API running on http://localhost:${PORT}`);
});
