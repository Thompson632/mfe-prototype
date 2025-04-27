import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';

const appName = 'cart';
const app = express();
const port = 3002;

const startTime: number = Date.now();

app.use(cors());

app.get('/api/health', (_: Request, res: Response): void => {
  const now: number = Date.now();
  const uptimeSeconds: number = Math.floor((now - startTime) / 1000);

  res.json({
    status: 'ok',
    service: appName,
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    uptimeSeconds
  });
});

app.get('/api', (_: Request, res: Response): void => {
  res.redirect('/');
});

app.get('/', (_: Request, res: Response): void => {
  res.send('Express Health Server is running.');
});

app.use((req: Request, res: Response): void => {
  res.status(404).json({ error: 'Route not found' });
});

app.use((err: Error, req: Request, res: Response, next: NextFunction): void => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    error: 'Internal Server Error',
    message: err.message || 'Unexpected error occurred'
  });
});

app.listen(port, (): void => {
  console.log(`🚀 [${appName}] Express Health Server running at http://localhost:${port}`);
});
