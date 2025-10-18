import express from 'express';
import cors from 'cors';
import profileRoutes from './routes/profile';

const app = express();
const port = process.env.PORT || 3001;

// Detailed CORS configuration
app.use(cors({
  origin: ['http://localhost:5173'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['Authorization'],
  credentials: true,
  optionsSuccessStatus: 204
}));
app.use(express.json());

app.get('/', (_req, res) => {
  res.send('Portal backend is alive');
});

app.use('/api/profile', profileRoutes);

// Handle 404s
app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

app.listen(port, () => {
  console.log(`Portal backend listening on port ${port}`);
});
